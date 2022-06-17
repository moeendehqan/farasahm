export const DatePickerToInt = (date)=>{
    if (date!=false){
        const yd = (date.year).toString()
        if(date.month.index+1<10){
            var md = '0'+(date.month.index+1).toString()
        }else{var md = (date.month.index+1).toString()}
        if(date.day<10){
            var dd = '0'+(date.day).toString()
        }else{var dd = (date.day).toString()}
        return yd+md+dd
    }else{
        return false    
    }

}