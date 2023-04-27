from django.shortcuts import render
from django.http import JsonResponse
from .models import Test, Info
from django.http import HttpResponse

import json
import yfinance as yf
import pandas as pd

def index(request):
    df = yf.download('AAPL', start='2023-01-01', end='2023-01-30')
    update = yf.download('AAPL', start='2023-02-01', end='2023-04-04')
    
    data = df.reset_index().to_dict(orient='records')
    update_data = update.reset_index().to_dict(orient='records')

    load(data)
    load(update_data)

    data_json = json.dumps(data)
    update_data_json = json.dumps(update_data)

    return render(request, 'index.html', {'data': data_json,'update_data':update_data_json})

def load(n):
    for d in n:
        d['Date'] = d['Date'].strftime('%Y-%m-%d')
        d['volume'] = d.pop('Volume')
        d.pop('Adj Close', None)
        d['time'] = d.pop('Date')
        d['open'] = d.pop('Open')
        d['high'] = d.pop('High')
        d['low'] = d.pop('Low')
        d['close'] = d.pop('Close')

def send(request):
    time = request.POST['time']
    slide = request.POST['slide']

    new_time = Test.objects.create(time = time, value = slide)
    new_time.save
    return HttpResponse('sent')

def getInfo(request,time):
    time_details = Info.objects.filter(time=time)
    # HttpResponse('ok')
    return JsonResponse({"info":list(time_details.values())})


