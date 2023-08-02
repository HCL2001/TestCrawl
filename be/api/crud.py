import urllib.parse
import json
import aiohttp
from bs4 import BeautifulSoup
from googletrans import Translator
from sqlalchemy.orm import Session
import models
async def crawl_taobao(keyWord: str):
    translator = Translator()
    product_list = []

    cookie_parameters = {
        'JSESSIONID': 'A5EA6A1FC6ED9491E8BFE168344D9E7C',
        '_cc_': 'VFC%2FuZ9ajQ%3D%3D',
        '_nk_': 'tb627551502528',
        '_samesite_flag_': 'true',
        '_tb_token_': 'ee73d9beb6709',
        'atpsida': 'c1ba942fb3fe1cbf03e466a6_1690536928_9',
        'aui': '2216209135380',
        '_tb_token_': '3e3868656177',
        'cancelledSubSites': 'empty',
        'cna': 'NVhKHQx8pxABASABDuD094HA',
        'cna': 'NVhKHQx8pxABASABDuD094HA',
        'cnaui': '2216209135380',
        'cookie1': 'AimSwy6Hu0cjkXBiNAEvUR5yUCjEb50QirZe9OQR8JM%3D',
        'cookie17': 'UUpgQEvyiTEr4C708g%3D%3D',
        'cookie2': '17baa001cddd95eeac0d14215754e2ba',
        'csg': 'c5ccb5b5',
        'dnk': 'tb627551502528',
        'existShop': 'MTY5MDUzNTUyMQ%3D%3D',
        'isg': 'BC4udLbkxtq_uDKu-9jGYYETf4TwL_Ipj4a_J1j3mTHsO86VwL6yOUI587_X4-pB',
        'l': 'fBIQOzNINiq0KI6SBOfZFurza779IIRAguPzaNbMi9fP911p5XodW1O06889CnMNFssBR38PiVPBBeYBqIv4n5U62j-la_HmnmOk-Wf..',
        'lgc': 'tb627551502528',
        'sca': '2ce1ff46',
        'sg': '807',
        'sgcookie': 'E1004mNHjdedFCalsA3%2BDwxBbDVzpPHNcfgCxQwpMn8WChT8qXmCxiXv2GtRWHqACR5GrqBtYgklE3nsJQ6iHc00COBH86rxO%2FnNB1FZN0UAlGA%3D',
        'skt': '5f59a84349d9041e',
        't': '6b6122a7cb9e97ce82d19b64b5cfa46b',
        'tbsa': '106e86f4144675054773332d_1690536928_9',
        'tfstk': 'd-N9HuZeMMjGzUMYGVBhgivTTP_hK5UNjlzWimmMhkELlDAc7fXqMonL0cDi1cAxMrE4moUV7qibcon0I9fu7PlqGgcAZ_4aQqlfq1ChKNaZgjsk-I6lwPrygXCFUn1fYdpww7Fx5t_FmoxTl5gtBmpivIdfoVHtVPidVg6a47VJxp-o2qv1Jwp23AgFr-S5t',
        'tracknick': 'tb627551502528',
        'uc1': 'cookie21=Vq8l%2BKCLiYYu&cookie14=Uoe9bfibByxgsA%3D%3D&cookie15=U%2BGCWk%2F75gdr5Q%3D%3D&existShop=false&pas=0&cookie16=WqG3DMC9UpAPBHGz5QBErFxlCA%3D%3D',
        'uc3': 'nk2=F5RDLjqWCLCCNe6Q0ac%3D&vt3=F8dCsGCg2j4K6APJSMg%3D&lg2=UIHiLt3xD8xYTw%3D%3D&id2=UUpgQEvyiTEr4C708g%3D%3D',
        'uc4': 'id4=0%40U2gqz6QY%2B2LU45CVgCnTHhyjgZBJlJ9d&nk4=0%40FY4I7WSY2SzxeSCD9wJSplBYHJwWmW5zVQ%3D%3D',
        'x5sec': '7b22617365727665723b32223a226539313338386538643739643266303964613031653838663861323366623766434f4b4d6a71594745506e57343658446c59476b65786f504d6a49784e6a49774f54457a4e544d344d4473324d4f79586a4e4d4451414d3d227d',
        'xlly_s': '1',
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    encoded_keyWord = urllib.parse.quote(keyWord, safe='')
    url = f"https://s.taobao.com/search?q={encoded_keyWord}"
    print(url)
    counter = 1
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, cookies=cookie_parameters) as resp:
            content = await resp.text()
            soup = BeautifulSoup(content, "html.parser")
            script_tags = soup.find_all("script")
        for script_tag in script_tags:
            script_content = script_tag.string
            if script_content and "g_page_config" in script_content:
                start_index = script_content.find("g_page_config =")
                end_index = script_content.find("}};")
                json_content = script_content[start_index + 15 : end_index +2]
                try:
                    g_page_config_json = json.loads(json_content)
                    data = g_page_config_json['mods']['itemlist']['data']['auctions']
                    for item in data:
                        name = translator.translate(item['raw_title'], src='zh-CN', dest='vi')
                        # print(item)
                        objectDto = {
                            'id': counter,
                            'name': name.text,
                            'link': item['detail_url'],
                            'price': item['view_price'],
                            'shopName': item['shopName'],
                        }
                        counter +=1
                        product_list.append(objectDto)
                except json.JSONDecodeError as e:
                    print(e)
    return product_list

def get_token(db: Session, token: str):
    try:
        result = db.query(models.Account).filter(models.Account.token == token)
        return result
    except Exception as e:
        return {
            'status': 'failed',
            'message': str(e)
        }
    finally:
        db.close()