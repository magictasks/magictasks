FROM timbru31/java-node:11-jod

WORKDIR /app

COPY package*.json ./

# Clear install with forced platform and architecture
RUN npm install --platform=linux --arch=arm64 --force

COPY . .

RUN rm -rf .git

RUN [ -d functions/node_modules ] || (cd functions && npm install --platform=linux --arch=arm64 --force)

EXPOSE 5173 9099 8080 9199 6001

CMD ["npm", "run", "dev-and-emulators"]