import subprocess
from datetime import datetime
from typing import Optional

import jwt
from croniter import croniter
from crontab import CronTab
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware

import config
import crud
import models
import schemas
from database import SessionLocal, engine
from security import verify_password, generate_token, validate_token, check_token_expired
from googletrans import *
import constant

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "https://reactjs-megasop.vercel.app",
    "https://react.thanhdev.info"
]

SECURITY_ALGORITHM = 'HS256'
SECRET_KEY = '123456'

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/search/{keyWord}")
async def search_taobao(keyWord: str):
    # translator = Translator()
    # # Chuyển tất cả về tiếng Anh để việc dịch gần đúng nhất
    # keyWordTranslateFirst = translator.translate(keyWord, dest=constant.ENGLISH).text
    # keyWordTranslateSecond = translator.translate(keyWordTranslateFirst, dest=constant.CHINESE).text
    # print(keyWordTranslateFirst)
    # print(keyWordTranslateSecond)
    return await crud.crawl_taobao(keyWord)

@app.post('/login')
def login(request_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    print(f'[x] request_data: {request_data.__dict__}')
    if verify_password(username=request_data.username, password=request_data.password, db=db):
        token = generate_token(request_data.username)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[SECURITY_ALGORITHM])
        expiration_time = datetime.fromtimestamp(payload["exp"])
        return {
            'token': token,
            'expiration_time': expiration_time
        }
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/taobao/{keyWord}", dependencies=[Depends(validate_token)])
async def search_taobao(keyWord: str):
    return await crud.crawl_taobao(keyWord)
