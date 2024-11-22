-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a function to search for documents
CREATE OR REPLACE FUNCTION match_huolto_ohjeet(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter jsonb DEFAULT '{}'::jsonb
) RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    piiroinen_chairs.id,
    piiroinen_chairs.content,
    jsonb_build_object(
      'similarity', 1 - (piiroinen_chairs.embedding <=> query_embedding)
    ) || piiroinen_chairs.metadata AS metadata,
    1 - (piiroinen_chairs.embedding <=> query_embedding) as similarity
  FROM piiroinen_chairs
  WHERE piiroinen_chairs.metadata @> filter
  ORDER BY piiroinen_chairs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;