# R script to grab and compare data from FRED


#Function that actually generates the correlation data frame
source("DataGenerate.R")

#Grab the data needed for Comparalel prototype
# Found at: https://fred.stlouisfed.org/series/SFXRSA
# Datasets used: San Francisco Home Price Index (SFXRSA), San Francisco Unemployment(SANF806UR),
# San Francisco Tech Pulse (SFTPINDM114SFRBSF), Seattle Home Price Index (SEXRSA), 
#Seattle Economic Conditions Index (STWAGRIDX)
df<-read.csv('fredgraph.csv') 
df<-df[38:354,] #Cut off all points where data isn't available for all 5 data points

#Generate CSV for when San Francisco Home Price Index is Primary
dataGenerate(df[,c(1,2,3,4)],'HPISF') #HPI SF, UR SF, Tech Pulse

#Generate CSV for when Home Price Index is Primary
df.temp<-df[,c(1,5,6,2)] # HPI Seattle, Economic Conditions Index Seattle, HPI SF
dataGenerate(df.temp,'HPISeattle')

#Generate CSV for when Seattle Economic Conditions Index is Primary
df.temp<-df[,c(1,6,5,4)] #Economic Conditions Index Seattle, HPI Seattle, Tech Pulse SF
dataGenerate(df.temp,'ECISeattle')

#Generate CSV for when SF Tech Pulse is primary
df.temp<-df[,c(1,4,2,5)] #Tech Pulse,Home Price Index SF, 
dataGenerate(df.temp,'TechPulse')

#Generate CSV for when SF Enmplyoment is primary
df.temp<-df[,c(1,3,4,2)] #Unemployment, Tech Pulse, Home Price Index
dataGenerate(df.temp,'URSF')

