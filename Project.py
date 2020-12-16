#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Dec 14 17:34:25 2020

@author: hodo
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


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
#covid = pd.read_excel('Covid-19/COVID-19-geographic-disbtribution-worldwide.xlsx')
#covid['Date'] = pd.to_datetime(covid['dateRep'])
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

#get extra points for Czech Republic and USA
usa = pf[pf['Country Name'] == "United States"]
cz = pf[pf['Country Name'] == "Czech Republic"]

#calculate correlation parameters
cm = pf[['Life Expectancy 2018','GNI 2019','Fatality Rate', 'Mortality Rate']].corr()
correlations = [
        cm['GNI 2019'].iloc[2],
        cm['GNI 2019'].iloc[3],
        cm['Life Expectancy 2018'].iloc[2],
        cm['Life Expectancy 2018'].iloc[3],
        ]

#Plot
sns.set_context("talk")
g = sns.PairGrid(pf, y_vars=['Fatality Rate','Mortality Rate'], 
                 x_vars=['GNI 2019', "Life Expectancy 2018"], 
                 height=6)
g.fig.subplots_adjust(top=0.9)
g.fig.suptitle('COVID-19 Mortality and Fatality dependency on GNI and life expectancy')

g.map(sns.regplot, color=".3")
#add highlighting for CZ and USA
g.axes[0,0].scatter(cz['GNI 2019'], cz['Fatality Rate'], marker = "o", color = "red", label = "Czech Republic")
g.axes[0,1].scatter(cz['Life Expectancy 2018'], cz['Fatality Rate'], marker = "o", color = "red")
g.axes[1,0].scatter(cz['GNI 2019'], cz['Mortality Rate'], marker = "o", color = "red")
g.axes[1,1].scatter(cz['Life Expectancy 2018'], cz['Mortality Rate'], marker = "o", color = "red")

g.axes[0,0].scatter(usa['GNI 2019'], cz['Fatality Rate'], marker = "o", color = "blue", label = "USA")
g.axes[0,1].scatter(usa['Life Expectancy 2018'], cz['Fatality Rate'], marker = "o", color = "blue")
g.axes[1,0].scatter(usa['GNI 2019'], cz['Mortality Rate'], marker = "o", color = "blue")
g.axes[1,1].scatter(usa['Life Expectancy 2018'], cz['Mortality Rate'], marker = "o", color = "blue")

#Correlation parameters
g.axes[0,0].text(70000, 0.08, "p = " + str(round(correlations[0],2)))
g.axes[0,1].text(57, 0.08, "p = " + str(round(correlations[2],2)))
g.axes[1,0].text(70000, 1.50 , "p = " + str(round(correlations[1],2)))
g.axes[1,1].text(57, 1.50, "p = " + str(round(correlations[3],2)))

xlims = [(0, 82000), (55, 86), (0, 82000), (55, 86)]
ylims = [(-0.01,0.1),(-0.01,0.1), (-0.1,1.6),(-0.1,1.6)]
xlabels = [None, None, 'GNI 2019 PPP [$]', 'Life Expectancy 2018 at birth [years]' ]
ylabels = ['Fatality Rate (deaths per number of cases)',None, 'Mortality rate (deaths per 1000 persons)', None]

for i in range(4):
    g.axes.flat[i].set_xlim(xlims[i])
    g.axes.flat[i].set_ylim(ylims[i])
    g.axes.flat[i].xaxis.set_label_text(xlabels[i])
    g.axes.flat[i].yaxis.set_label_text(ylabels[i])

# Build custom legend
from matplotlib.lines import Line2D
legend_elements = [Line2D([0], [0], marker='o', color = 'white', markerfacecolor='red', label='CZ'),
                   Line2D([0], [0], marker='o', color='white', markerfacecolor='blue', label='USA')]

g.axes[0,1].legend(loc=10, bbox_to_anchor=(0, 0.02), handles=legend_elements, framealpha = 1, facecolor = "white", edgecolor = "black")
plt.show(g)
g.fig.savefig("plot.png")
plt.close()