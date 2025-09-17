package main

import (
	"fmt"
	"regexp"
	"math/rand"
	"time"
)
    var phonenumber string;
	var choose int
	var codenumber int
	var contacts1 map[string]int
	var contacts2 map[string]time.Time
	var contacts3 map[string]int
	var x int
	var code int

func main(){
	contacts3 = make(map[string]int)
	fmt.Printf("请输入手机号码：");
	fmt.Scanln(&phonenumber);
	contacts3[phonenumber] = 5
    testphonenumber(phonenumber)
}



func testphonenumber(phonenumber string){
	patern := `^1[3456789]\d{9}$`
	exam := regexp.MustCompile(patern);
	if exam.MatchString(phonenumber){
		x = 0
		test()
	}else {
		fmt.Println("请输入正确形式的电话号码。")
		main()
	}
}

func test(){
	fmt.Println("1：请输入六位验证码进行登录  2：获取验证码")
        fmt.Scanln(&choose)
		switch choose {
		case 1:
			choose1()
			
		case 2:
			now := time.Now()
			t1 := contacts2["savetime"].Add(1 * time.Minute)
			t2 := contacts2["savetime"].Add(5 * time.Minute)
			if x == 0{
				x++
				choose2()
			}else if now.Before(t1){
				fmt.Println("一分钟内无法再次获取验证码")
				test()
			}else if now.Before(t2){
				choose2()

			}else {
				fmt.Println("验证码超过5分钟，已删除")
				delete(contacts1, "验证码")
				x--
				test()
			}
			    
		    
			
		default:
			fmt.Println("内容错误")
			test()
		}
	}

func choose1(){
    fmt.Println("请输入验证码")
		fmt.Scanln(&code)
		if code == contacts1["验证码"] {
			fmt.Println("登录成功！")
			fmt.Println("验证码已失效")
			delete(contacts1, "验证码")
		}else {
			fmt.Println("登录失败")
			test()
	}
}

func choose2(){
		var codearr [6]int
	    contacts1 = make(map[string]int)
		if contacts3[phonenumber] > 0{
		for i := 0; i < 6; i++{
			codearr[i] = rand.Intn(9) + 1
		}
		codenumber = codearr[0]*100000 + codearr[1]*10000 + codearr[2]*1000 + codearr[3]*100 + codearr[4]*10 + codearr[5]
		/*for y := 0; y < 6; y++ {
            codenumber = codenumber + codearr[y]*math.Pow(10, (5-y))
        }   */
		contacts1["验证码"] = codenumber
		fmt.Printf("验证码为：%d\n", contacts1["验证码"])
		contacts3[phonenumber]--
		contacts2 = make(map[string]time.Time)
		nowTime := time.Now()
		contacts2["savetime"] = nowTime
		test()

	}else {
		fmt.Println("一天内最多只能获取5次验证码哦")
		test()
	}
	
}
