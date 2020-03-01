from datetime import date
import folium
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

data 		= pd.read_csv("data/2019_nCoV_data.csv")

data['Date']= data['Date'].apply(pd.to_datetime)
data.drop(['Sno'],axis=1,inplace=True)

countries 	= data['Country'].unique().tolist()

data['Country'].replace({'Mainland China':'China'},inplace=True) # China and Mainland China is reported separately (why?)
countries 	= data['Country'].unique().tolist()

d 			= data['Date'][-1:].astype('str')
year 		= int(d.values[0].split('-')[0])
month 		= int(d.values[0].split('-')[1])
day 		= int(d.values[0].split('-')[2].split()[0])
data_latest	= data[data['Date'] > pd.Timestamp(date(year,month,day))]

# Creating a dataframe with total no of confirmed cases for every country
Number_of_countries = len(data_latest['Country'].value_counts())
cases 				= pd.DataFrame(data_latest.groupby('Country')['Confirmed'].sum())
cases['Country'] 	= cases.index
cases.index			= np.arange(1, Number_of_countries+1)
global_cases 		= cases[['Country','Confirmed']]

world_coordinates 	= pd.read_csv('data/world_coordinates.csv')

# Merging the coordinates dataframe with original dataframe
world_data = pd.merge(world_coordinates, global_cases, on='Country')

# create map and display it
world_map = folium.Map(location=[10, -20], zoom_start=2.3,tiles='Stamen Toner')

for lat, lon, value, name in zip(world_data['latitude'], world_data['longitude'], world_data['Confirmed'], world_data['Country']):
	folium.CircleMarker([lat, lon],
						radius=10,
						popup = ('<strong>Country</strong>: ' + str(name).capitalize() + '<br>'
								'<strong>Confirmed Cases</strong>: ' + str(value) + '<br>'),
						color='red',                        
						fill_color='red',
						fill_opacity=0.7 ).add_to(world_map)
world_map.save("data/world_map.html")

# China 	= data_latest[data_latest['Country'] == 'China']

# bars 		= China["Province/State"].to_numpy()
# death 		= China["Deaths"].to_numpy()
# recovered 	= China["Recovered"].to_numpy()
# confirmed 	= China["Confirmed"].to_numpy()

# Hubei 		= (int(death[0]), int(recovered[0]), int(confirmed[0]))

# # Exclude Hubei
# bars		= bars[1:]
# death		= death[1:]
# recovered	= recovered[1:]
# confirmed	= confirmed[1:]
# y_pos 		= np.arange(len(bars))
# width 		= 0.8

# fig, ax = plt.subplots(figsize=(30, 20))
# ax.set_title("Coronavirus (2019-nCoV) Confirmed, Recovered, Death Status in China (exclude Hubei)\n", fontsize=30)
# ax.barh(y_pos, confirmed, width, color='red', label='Confirmed')
# ax.barh(y_pos, recovered, width, color='green', label='Recovered')
# ax.barh(y_pos, death, width, color='black', label='Death')

# for i, v in enumerate(confirmed):
# 	if v == 0: continue
# 	plt.text(v + 3, i - 0.2, str(int(v)), color='black', fontsize=20)

# for i, v in enumerate(recovered):
# 	if v == 0: continue
# 	plt.text(v + 3, i - 0.2, str(int(v)), color='white', fontsize=20)

# for i, v in enumerate(death):
# 	if v == 0 or (recovered[i] - death[i] < 4): continue
# 	plt.text(v + 3, i - 0.2, str(int(v)), color='white', fontsize=20)

# ax.text(600, 24, "Hubei - Confirmed: " + str(Hubei[2]) + ", Recovered: " + str(Hubei[1]) + ", Deaths: " + str(Hubei[0]), bbox=dict(facecolor='red', alpha=0.1), fontsize=20)
# ax.set(yticks=y_pos, yticklabels=bars)
# for tick in ax.xaxis.get_major_ticks():
#     tick.label.set_fontsize(25) 

# for tick in ax.yaxis.get_major_ticks():
#     tick.label.set_fontsize(25) 

# ax.legend(fontsize=20)

# # plt.show()
# plt.savefig('data/nCov_status_china.png', bbox_inches="tight") 

