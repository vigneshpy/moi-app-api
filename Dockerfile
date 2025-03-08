# Stage 1: Build Stage
FROM node:22 AS build

WORKDIR /src

# Copy package.json and install dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production Stage (Slimmer Image)
FROM node:22 AS prod

WORKDIR /src

# Copy only necessary files from build stage
COPY --from=build /src/dist dist
COPY --from=build /src/node_modules node_modules
COPY package.json .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
