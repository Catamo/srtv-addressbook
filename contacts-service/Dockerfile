FROM lambci/lambda:build-nodejs8.10

# Create a new user group and user to our new container and avoid the root user
RUN groupadd --system appgroup && useradd --system appuser -G appgroup

ENV HOME=/home/appuser

COPY package.json $HOME/app/

COPY src/ $HOME/app/src

RUN chown -R appuser:appgroup $HOME/* /usr/local/

WORKDIR $HOME/app

RUN npm install

RUN chown -R appuser:appgroup $HOME/*
USER appuser

# EXPOSE 4000

CMD ["npm", "start"]