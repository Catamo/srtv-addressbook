FROM node:8.15.1-alpine

# Create a new user group and user to our new container and avoid the root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV HOME=/home/appuser

COPY package.json $HOME/app/

COPY src/ $HOME/app/src

RUN chown -R appuser:appgroup $HOME/* /usr/local/

WORKDIR $HOME/app
RUN npm cache clean --force && \
    npm cache verify && \
    npm install --silent --progress=false --production

RUN chown -R appuser:appgroup $HOME/*
USER appuser

# EXPOSE 3000

CMD ["npm", "start"]
