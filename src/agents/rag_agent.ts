import { Agent } from "agents";

export class RAGAgent extends Agent<Env> {
  async queryKnowledge(userQuery) {
    // Turn a query into an embedding
    const queryVector = await this.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [userQuery],
    });

    // Retrieve results from our vector index
    const searchResults = await this.env.VECTOR_DB.query(queryVector.data[0], {
      topK: 10,
      returnMetadata: "all",
    });

    const knowledge = [];
    for (const match of searchResults.matches) {
      console.log(match.metadata);
      knowledge.push(match.metadata);
    }

    // Use the metadata to re-associate the vector search results
    // with data in our Agent's SQL database
    const results = this.sql`SELECT * FROM knowledge WHERE id IN (${knowledge?.map((k) => k.id)})`;

    // Return them
    return results;
  }
}
