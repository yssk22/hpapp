import DemoScraper from './DemoScraper';
import UPFCScraper from './UPFCScraper';
import URLFetcher from './URLFetcher';
import { Scraper } from './types';

const scraper = new UPFCScraper(new URLFetcher());
const demoScraper = new DemoScraper();

const useScraper = (useDemo: boolean): Scraper => {
  if (useDemo) {
    return demoScraper;
  }
  return scraper;
};

export { useScraper };
