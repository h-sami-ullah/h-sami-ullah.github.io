---
layout: default
title: "Daily Stock Price Forecasting"
description: "Comparing LSTM and statistical time-series models for daily stock price forecasting."
permalink: /stock-forecasting/
---

# Daily Stock Price Forecasting

This project compares a Long Short-Term Memory network with ARIMA, moving average, and autoregressive models across several stock-price datasets. The goal was not just accuracy on one series, but consistent behaviour across different financial time series.

**Project description:** Financial time series are noisy, non-stationary, and shaped by conditions that statistical models often struggle to represent. This study evaluates whether an LSTM can capture sequential patterns more reliably than classic statistical baselines, and whether its advantage holds across multiple company datasets.

## Moving average

Moving average smooths a series by averaging the most recent `K` observations. It is useful for identifying broad direction and removing short-term noise, but it does not model temporal dependencies beyond the chosen window.

## Autoregression model

Autoregression predicts the next value from previous values in the series. It is simple and interpretable, but its fixed assumptions can break down when the underlying process changes over time.

```python
from statsmodels.tsa.ar_model import AutoReg

model = AutoReg(train_ar)
model_fit = model.fit()
window = model_fit.k_ar
coef = model_fit.params
```

## ARIMA model

ARIMA combines autoregression, differencing, and moving average terms. The `p`, `d`, and `q` parameters control the autoregressive order, stationarity transformation, and moving-average order.

```python
from statsmodels.tsa.arima.model import ARIMA

history = [x for x in train_arima]
predictions = []
model = ARIMA(history, order=(1, 1, 0))
model_fit = model.fit()
yhat = model_fit.forecast()[0]
predictions.append(yhat)
```

## LSTM model

The LSTM model was implemented with Keras on top of TensorFlow. It unrolls the series along the time axis and uses internal cell state to retain sequential information across earlier time steps.

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential()
model.add(LSTM(units=80, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(units=80))
model.add(Dropout(0.25))
model.add(Dense(units=1))
model.compile(optimizer="adamax", loss="mean_squared_error")
model.fit(X_train, y_train, epochs=10, batch_size=150)
```

## Pipeline

![Forecasting pipeline]({{ "/images/pipeline.png" | relative_url }})

## Findings

The LSTM model outperformed the statistical baselines and was more consistent across datasets. ARIMA, moving average, and autoregression produced more variable results because they adapted less reliably to changes in the series.
