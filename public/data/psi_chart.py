import numpy as np 
import pandas as pd 
import datetime
import matplotlib.pyplot as plt
import seaborn as sns

psi = pd.read_csv("data/psi_df_2016_2019.csv")

psi['timestamp']		= pd.to_datetime(psi['timestamp'])
psi['year_month'] 		= pd.to_datetime(psi['timestamp']).dt.to_period('M')
psi['year'] 			= pd.DatetimeIndex(psi['timestamp']).year
psi['month'] 			= pd.DatetimeIndex(psi['timestamp']).month
all_area 				= ['national','south', 'north', 'east', 'central', 'west']
psi['overall_mean'] 	= psi[all_area].mean(axis=1, skipna=True)
by_month 				= psi.groupby(['year_month']).mean()
by_month['yearmonth'] 	= by_month.index.to_timestamp()
month_index 			= np.array(by_month.index)

plt.figure(figsize=(40,20)).suptitle('Monthly Average Singapore PSI by Area \n(Feb 2016 to Nov 2019)', fontsize=35)
plt.plot(by_month['yearmonth'], by_month[all_area])
plt.legend(all_area, loc="upper left", fontsize=25)
plt.xlabel('Month', fontsize=25)
plt.ylabel('PSI', fontsize=25)
plt.xticks(fontsize=20, rotation=0)
plt.yticks(fontsize=25, rotation=0)
plt.savefig('data/Monthly_Avg_Psi.png') # plt.show()

plt.figure(figsize=(40,20)).suptitle('Monthly Average Singapore PSI \n(Feb 2016 to Nov 2019)', fontsize=35)
clrs = []
for x in by_month['overall_mean']:
	if x == max(by_month['overall_mean']):		clrs.append('red')
	elif x == min(by_month['overall_mean']): 	clrs.append('blue')
	else: clrs.append('grey')
sns.barplot(x=month_index, y=by_month['overall_mean'], palette=clrs) # color=clrs)
xlocs = np.arange(len(by_month.index))
for i, v in enumerate(by_month['overall_mean']):
	val = np.round(v, 2)
	plt.text(xlocs[i] - 0.5, v + 0.3, str(val), fontsize=16)
plt.xlabel('Month', fontsize=25)
plt.ylabel('PSI', fontsize=25)
plt.xticks(xlocs, by_month.index, fontsize=20, rotation=90)
plt.yticks(fontsize=25, rotation=0)
ls = ['blue - lowest PSI over time', 'red - lowest PSI over time']
plt.legend(ls, loc="upper left",fontsize=30)
plt.savefig('data/Monthly_Avg_Psi_2.png') # plt.show()

plt.figure(figsize=(40,20)).suptitle('Monthly Average Singapore PSI \n(Feb 2016 to Nov 2019)', fontsize=35)
clrs = ['grey' if (x <= 55) else 'orange' for x in by_month['overall_mean'] ]
sns.barplot(x=month_index, y=by_month['overall_mean'], palette=clrs) # color=clrs)
xlocs = np.arange(len(by_month.index))
for i, v in enumerate(by_month['overall_mean']):
	val = np.round(v, 2)
	plt.text(xlocs[i] - 0.5, v + 0.3, str(val), fontsize=16)
plt.xlabel('Month', fontsize=25)
plt.ylabel('PSI', fontsize=25)
plt.xticks(xlocs, by_month.index, fontsize=20, rotation=90)
plt.yticks(fontsize=25, rotation=0)
ls = ['grey - normal (0 - 55)', 'orange - elevated (56 - 150)']
plt.legend(ls, loc="upper left",fontsize=30)
plt.savefig('data/Monthly_Avg_Psi_3.png') # plt.show()
