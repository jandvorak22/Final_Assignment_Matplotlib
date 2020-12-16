#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Dec 14 17:34:25 2020

@author: hodo
"""

import pandas as pd


#Economics Data for 2018/2019
#Dataset from WorldBank.org
#Using GNI (PPP) and Life Expectancy
#https://databank.worldbank.org/home.aspx
df = pd.read_csv("GDP_World_Bank_Org/d814fd90-e4ff-469c-96f2-5b892968f91d_Data.csv", na_values = "..")

xf = df[df['Series Name'] == 'Life expectancy at birth, total (years)'][['Country Name', 'Country Code', '2018 [YR2018]', '2019 [YR2019]' ]].reset_index().drop("index", axis = 1)
xf = xf.rename(columns = {'2018 [YR2018]':'Life Expectancy 2018', '2019 [YR2019]':'Life Expectancy 2019' })
xf['GNI 2018'] = df[df['Series Name'] == 'GNI per capita, PPP (current international $)']['2018 [YR2018]'].reset_index(drop=True)
xf['GNI 2019'] = df[df['Series Name'] == 'GNI per capita, PPP (current international $)']['2019 [YR2019]'].reset_index(drop=True)
xf['Population 2018'] = df[df['Series Name'] == "Population, total"]['2018 [YR2018]'].reset_index(drop=True)
xf['Population 2019'] = df[df['Series Name'] == "Population, total"]['2019 [YR2019]'].reset_index(drop=True)

#Covid19 Data
# Dataset from ECDC.Europa.eu
# Summing numbers of cases and deaths 
# https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
covid = pd.read_excel('Covid-19/COVID-19-geographic-disbtribution-worldwide.xlsx')
covid['Date'] = pd.to_datetime(covid['dateRep'])
#print(covid.columns)
covid = covid[['Date', 'countriesAndTerritories', 'countryterritoryCode', 'cases', 'deaths']]
covid_sum = covid.groupby('countriesAndTerritories').sum()
covid_cc = covid[['countriesAndTerritories', 'countryterritoryCode']].drop_duplicates().reset_index(drop=True)
covid_sum = pd.merge(covid_sum,covid_cc, how = 'inner', on = 'countriesAndTerritories')
covid_sum.reset_index(inplace=True)

#merge databases on country code - some countries are not included in both lists ==> ignore those
pf = pd.merge(xf, covid_sum, how='inner', left_on = 'Country Code', right_on = 'countryterritoryCode')
pf = pf[pf['cases']>10000] #limit only to countries with reasonable statistic
pf['Fatality Rate'] = pf['deaths'] / pf['cases'] # Fatality ~ how many diagnosed patients die on disease
pf['Mortality Rate'] = pf['deaths'] / pf['Population 2019'] *1000 # how many people die per 1000 persons in population


print(pf[['Life Expectancy 2018','GNI 2019','Fatality Rate', 'Mortality Rate']].corr().to_string())

import matplotlib.pyplot as plt
from pandas.plotting import scatter_matrix
axes = scatter_matrix(pf[['Life Expectancy 2018','GNI 2019', 'Fatality Rate', 'Mortality Rate']], diagonal='kde')

import seaborn as sns
axes = sns.regplot(pf['Life Expectancy 2018'],pf['Mortality Rate'], color ='blue')
axes = sns.regplot(pf['GNI 2019'],pf['Fatality Rate'], color ='blue')

pf[pf['Country Name'] == "United States"]
pf[pf['Country Name'] == "Czech Republic"]
