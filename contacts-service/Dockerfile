FROM node:10.15.3-alpine

# Create a new user group and user to our new container and avoid the root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup  appgroup

ENV HOME=/home/appuser

COPY package.json npm-shrinkwrap.json $HOME/app/

COPY src/ $HOME/app/src

RUN chown -R appuser:appgroup $HOME/* /usr/local/

WORKDIR $HOME/app
RUN npm cache clean --force && \
    npm cache verify && \
    npm install --silent --progress=false --production

RUN chown -R appuser:appgroup $HOME/*
USER appuser

EXPOSE 4000

CMD ["npm", "start"]
