ALTER TABLE "chat_messages" 
ALTER COLUMN "content" 
SET DATA TYPE jsonb 
USING content::jsonb;