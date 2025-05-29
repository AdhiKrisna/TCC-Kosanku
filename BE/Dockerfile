FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
# Set the PORT env var (though Cloud Run will override it)
ENV PORT=5000
EXPOSE 5000
CMD ["node", "index.js"]