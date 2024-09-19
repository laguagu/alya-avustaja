import { Document } from "@langchain/core/documents";
import { VectorStore } from "@langchain/core/vectorstores";

export default class RelevanceThresholdRetriever {
  private vectorStore: VectorStore;
  private k: number;
  private threshold: number;
  private cache: Map<string, Document[]>;
  private lastQueryTime: number = 0;
  private queryInterval: number = 10000; // 10 seconds

  constructor(vectorStore: VectorStore, k: number, threshold: number) {
    this.vectorStore = vectorStore;
    this.k = k;
    this.threshold = threshold;
    this.cache = new Map();
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    const now = Date.now();
    if (now - this.lastQueryTime < this.queryInterval) {
      console.log("Query too soon, returning cached or empty results");
      return this.cache.get(query) || [];
    }
    this.lastQueryTime = now;

    if (this.cache.has(query)) {
      console.log("Returning cached results");
      return this.cache.get(query)!;
    }

    if (!query) {
      console.error("Received empty query in getRelevantDocuments");
      return [];
    }

    const results = await this.vectorStore.similaritySearchWithScore(
      query,
      this.k * 2,
    );
    // console.log("All results:", JSON.stringify(results, null, 2));

    let filteredResults = results.filter(
      ([_, score]) => score >= this.threshold,
    );
    // console.log("Filtered results:", JSON.stringify(filteredResults, null, 2));

    if (filteredResults.length === 0) {
      // console.log("No documents passed the threshold. Using top results.");
      filteredResults = results.slice(0, this.k);
    } else if (filteredResults.length > this.k) {
      // console.log(`Limiting to top ${this.k} results.`);
      filteredResults = filteredResults.slice(0, this.k);
    }

    const documents = filteredResults.map(([doc, _]) => doc);
    this.cache.set(query, documents);
    return documents;
  }
}
