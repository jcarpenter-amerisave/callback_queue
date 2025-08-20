FROM amcdevacr.azurecr.io/mortgagems/devops/build-images/amerisave-node-image:2.0.0 AS builder

ARG ARTIFACT_REPO_URL
ARG ARTIFACT_REPO_USER
ARG ARTIFACT_REPO_PASS

ENV SOURCE_DIR /tmp/src
ENV DESTINATION_DIR app

COPY . $SOURCE_DIR

RUN echo $'registry=${ARTIFACT_REPO_URL}/api/npm/npm/\n\
    @amerisave:registry=${ARTIFACT_REPO_URL}/api/npm/npm/\n\
    //artifacts.amerisave.com/artifactory/api/npm/npm/:_authToken=${ARTIFACT_REPO_PASS}\n\
    ' > $SOURCE_DIR/.npmrc

RUN cd $SOURCE_DIR && npm ci --cache .npm --prefer-offline

RUN mkdir -p $DESTINATION_DIR && \
    cd $DESTINATION_DIR && \
    cp $SOURCE_DIR/package.json . && \
    mv $SOURCE_DIR/node_modules . && \
    mv $SOURCE_DIR/README.md . && \
    mv $SOURCE_DIR/public . && \
    mv $SOURCE_DIR/package-lock.json . && \
    mv $SOURCE_DIR/server.js . && \
    mv $SOURCE_DIR/src  .


FROM amcdevacr.azurecr.io/mortgagems/devops/base-service-images/node-lts-service-image:0.3.0
COPY --from=builder app/ .
CMD ["npm", "run", "start"]