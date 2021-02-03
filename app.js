'use strict';
const fs = require('fs');
const readline = require('readline');
const { isNull } = require('util');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();
rl.on('line',lineString=>{
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if(year === 2010 || year === 2015){
    let value = prefectureDataMap.get(prefecture);
    if(!value){
      value = {
        popu10:0,
        popu15:0,
        change:null
      };
    }
    if(year === 2010){
      value.popu10 = popu;
    }
    if(year === 2015){
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture,value);
  }
});

rl.on('close',()=>{
  for(let[key,value] of prefectureDataMap){
    value.change = value.popu15/value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2)=>{
    return pair1[1].change - pair2[1].change;
  });

  let rank = 0;
  console.log('増加量昇順');

  const rankingStrings = rankingArray.map(([key,value])=>{
    rank += 1;
    let suffix = 'st';
    if((11 <= rank && rank <= 13) || rank % 10 == 0 || 3 < rank % 10){
      suffix = 'th';
    }else if(rank % 10 == 2){
      suffix = 'nd';
    }else if(rank % 10 == 3){
      suffix = 'rd';
    }
    return(
      rank+
      suffix+
      ' '+
      key+
      ': '+
      value.popu10+
      '=>'+
      value.popu15+
      ' 変化率:'+
      value.change
    );
  });
  console.log(rankingStrings);
});