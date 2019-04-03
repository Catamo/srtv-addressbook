FROM lambci/lambda:build-nodejs6.10 

# Create a new user group and user to our new container and avoid the root user
RUN groupadd --system appgroup && useradd --system appuser -G appgroup

ENV HOME=/home/appuser

COPY package.json npm-shrinkwrap.json serviceAccountKey.json $HOME/app/

COPY src/ $HOME/app/src

RUN chown -R appuser:appgroup $HOME/* /usr/local/

WORKDIR $HOME/app
RUN npm cache clear --force . && \
    npm install --silent --progress=false --production

RUN chown -R appuser:appgroup $HOME/*
USER appuser

# EXPOSE 4000

CMD ["npm", "start"]