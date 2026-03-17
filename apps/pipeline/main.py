"""WorkRadar Pipeline CLI — scrape, parse, embed, match, and enrich jobs."""

from __future__ import annotations

import asyncio
import logging
import sys
from typing import Any

import click
from dotenv import load_dotenv

from config import PipelineConfig, get_config


def _setup_logging(level: str) -> None:
    """Configure structured logging for the pipeline."""
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
    )


def _run_async(coro: Any) -> Any:
    """Run an async coroutine, creating an event loop if needed."""
    return asyncio.run(coro)


# ======================================================================
# CLI group
# ======================================================================

@click.group()
@click.option("--env-file", default=".env", help="Path to .env file.")
@click.pass_context
def cli(ctx: click.Context, env_file: str) -> None:
    """WorkRadar Pipeline — AI-powered job ingestion and matching."""
    load_dotenv(env_file)
    config = get_config()
    _setup_logging(config.log_level)
    ctx.ensure_object(dict)
    ctx.obj["config"] = config


# ======================================================================
# scrape
# ======================================================================

@cli.command()
@click.option("--sources", default="all", help="Comma-separated scraper names or 'all'.")
@click.pass_context
def scrape(ctx: click.Context, sources: str) -> None:
    """Scrape job postings from configured sources."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.scrape")

    async def _run() -> None:
        from scrapers.ashby import AshbyScraper
        from scrapers.greenhouse import GreenhouseScraper
        from scrapers.hn_hiring import HNHiringScraper
        from scrapers.lever import LeverScraper
        from scrapers.remoteok import RemoteOKScraper
        from scrapers.runner import ScraperRunner
        from scrapers.weworkremotely import WeWorkRemotelyScraper

        all_scrapers = {
            "hn_hiring": HNHiringScraper(config=config),
            "greenhouse": GreenhouseScraper(config=config),
            "lever": LeverScraper(config=config),
            "remoteok": RemoteOKScraper(config=config),
            "weworkremotely": WeWorkRemotelyScraper(config=config),
            "ashby": AshbyScraper(config=config),
        }

        if sources == "all":
            selected = list(all_scrapers.values())
        else:
            names = [s.strip() for s in sources.split(",")]
            selected = [all_scrapers[n] for n in names if n in all_scrapers]

        if not selected:
            logger.error("No valid scrapers selected.")
            return

        runner = ScraperRunner(scrapers=selected, config=config)
        jobs = await runner.run()
        stored = await runner.store(jobs)
        logger.info("Pipeline complete: scraped %d jobs, stored %d", len(jobs), stored)

    _run_async(_run())


# ======================================================================
# parse
# ======================================================================

@cli.command()
@click.option("--batch-size", default=50, help="Number of jobs to parse per batch.")
@click.pass_context
def parse(ctx: click.Context, batch_size: int) -> None:
    """Parse raw job postings using AI."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.parse")

    async def _run() -> None:
        from parsers.ai_parser import AIJobParser

        parser = AIJobParser(config=config)
        # In production, fetch unparsed raw jobs from database here
        logger.info("AI parser ready (model: %s)", config.anthropic_model)
        logger.info("Run with raw jobs from database — batch size: %d", batch_size)

    _run_async(_run())


# ======================================================================
# embed
# ======================================================================

@cli.command()
@click.pass_context
def embed(ctx: click.Context) -> None:
    """Generate embeddings for parsed jobs and profiles."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.embed")

    async def _run() -> None:
        from embeddings.generator import EmbeddingGenerator

        generator = EmbeddingGenerator(config=config)
        logger.info(
            "Embedding generator ready (model: %s, dims: %d)",
            config.embedding_model,
            config.embedding_dimensions,
        )
        # In production, fetch parsed jobs without embeddings and embed them

    _run_async(_run())


# ======================================================================
# match
# ======================================================================

@cli.command()
@click.pass_context
def match(ctx: click.Context) -> None:
    """Run the matching engine for all active profiles."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.match")

    from matching.engine import MatchingEngine

    engine = MatchingEngine(config=config)
    logger.info(
        "Matching engine ready (min_score: %.2f, weights: vector=%.2f skill=%.2f)",
        config.match_min_score,
        config.match_weight_vector,
        config.match_weight_skill,
    )
    # In production, fetch profiles and new jobs, run match_profile_against_jobs


# ======================================================================
# scan-radars
# ======================================================================

@cli.command("scan-radars")
@click.pass_context
def scan_radars(ctx: click.Context) -> None:
    """Scan active radar configurations against new jobs."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.radars")

    async def _run() -> None:
        from matching.radar_scanner import RadarScanner

        scanner = RadarScanner()
        logger.info("Radar scanner ready.")
        # In production, fetch active radar configs and new jobs, run scanner.scan()

    _run_async(_run())


# ======================================================================
# enrich
# ======================================================================

@cli.command()
@click.pass_context
def enrich(ctx: click.Context) -> None:
    """Enrich company data and visa intelligence."""
    config: PipelineConfig = ctx.obj["config"]
    logger = logging.getLogger("pipeline.enrich")

    async def _run() -> None:
        from enrichment.company import CompanyEnricher
        from enrichment.visa_intel import VisaIntelligence

        async with CompanyEnricher(config=config) as enricher:
            logger.info("Company enricher ready.")

        async with VisaIntelligence(config=config) as visa:
            logger.info("Visa intelligence ready.")

        # In production, fetch companies to enrich from database

    _run_async(_run())


# ======================================================================
# full-pipeline
# ======================================================================

@cli.command("full-pipeline")
@click.pass_context
def full_pipeline(ctx: click.Context) -> None:
    """Run the full pipeline: scrape -> parse -> embed -> match -> scan-radars -> enrich."""
    logger = logging.getLogger("pipeline.full")
    logger.info("Starting full pipeline run...")

    ctx.invoke(scrape)
    ctx.invoke(parse)
    ctx.invoke(embed)
    ctx.invoke(match)
    ctx.invoke(scan_radars)
    ctx.invoke(enrich)

    logger.info("Full pipeline run complete.")


# ======================================================================
# Entry point
# ======================================================================

if __name__ == "__main__":
    cli()
