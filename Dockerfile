FROM node:17.1.0

WORKDIR /application

COPY ui ./
RUN npm install

FROM python:3.10

COPY --from=0 build ./secret_santa/build
COPY requirements.txt src ./

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV FLASK_APP=secret_santa.web.app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
ENV SECRET_SANTA_CUTOFF_DATETIME=2021-12-20
ENV SECRET_SANTA_SALT=mysecret

ENTRYPOINT ["flask", "run"]
