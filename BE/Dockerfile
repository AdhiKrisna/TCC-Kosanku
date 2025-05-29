FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
# Set the PORT env var (though Cloud Run will override it)
EXPOSE 8080
CMD ["node", "app.js"]