dataGenerate<-function(df,title){
  #Rename columns so they can genereally addressesed
  colnames(df)<-c('date','data1','data2','data3')
  #flag1 looks at correlations between data1 & data2
  #flag2 looks at correlations between data1 & data3
  df$flag1 <- 0
  df$flag2<-0
  
  #Set min. data points to find correlation
  #Looks at 10 data points at a time to find correlated subsections
  i<-10
  
  df$data1<-as.numeric(as.character(df$data1))
  df$data2<-as.numeric(as.character(df$data2))
  df$data3<-as.numeric(as.character(df$data3))
  
  df<-df[complete.cases(df),]
  
  #Subset master data frame for first iteration
  df.temp<-df[(i-10):i,]
  
  
  #First iteration of subset correlation
  fit<-lm(df.temp$data1 ~ df.temp$data2)
  r2<-summary(fit)$r.squared
  
  #Considered correlated at a r2 > 0.95
  if(r2>0.95){
    df$flag1[1:10]<-1
  }
  #Iterate throguh data frame for flag1 correlation values
  for(i in 10:nrow(df)){
    df.temp<-df[(i-10):i,]
    fit<-lm(df.temp$data1 ~ df.temp$data2)
    r2<-summary(fit)$r.squared
    if(r2>0.9625){
      df$flag1[(i-10):i]<-1
    }
    else{
      df$flag1[i]<-0
    }
  }
  #Iterate throguh data frame2 for flag1 correlation values
  for(i in 10:nrow(df)){
    df.temp<-df[(i-10):i,]
    fit<-lm(df.temp$data1 ~ df.temp$data3)
    r2<-summary(fit)$r.squared
    if(r2>0.9625){
      df$flag2[(i-10):i]<-1
    }
    else{
      df$flag2[i]<-0
    }
  }
  #Write CSV of given primary dataset
  write.csv(df,file=paste0('primary',title,'.csv'),row.names = F,quote=FALSE)
  
  
}
