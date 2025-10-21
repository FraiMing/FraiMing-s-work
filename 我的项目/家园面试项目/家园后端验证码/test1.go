package main

import (
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

type phoneVerification struct {
	phoneNumber string
	choose int
	codeNumber int
	code int
	times map[string]int
	saveTime time.Time
	time2 time.Time
	lastDate string
}

func NewPhoneVerification() *phoneVerification {
	return &phoneVerification{
		times: make(map[string]int),
	}
}

func main() {
	verification := NewPhoneVerification()
	verification.Start()
}

func (pv *phoneVerification) Start() {
	fmt.Printf("请输入手机号码：")
	fmt.Scanln(&pv.phoneNumber)
	
	if pv.times[pv.phoneNumber] == 0 {
		pv.times[pv.phoneNumber] = 5
	}
	
	pv.testPhoneNumber()
}

func (pv *phoneVerification) testPhoneNumber() {
	patern := `^1[3456789]\d{9}$`
	exam := regexp.MustCompile(patern)
	
	if exam.MatchString(pv.phoneNumber) {
		pv.lastDate = time.Now().Format("2006-01-02")
		pv.test()
	} else {
		fmt.Println("请输入正确形式的电话号码。")
		pv.Start()
	}
}

func (pv *phoneVerification) test() {
	fmt.Println("1：请输入六位验证码进行登录  2：获取验证码")
	fmt.Scanln(&pv.choose)
	
	switch pv.choose {
	case 1:
		pv.choose1()

	case 2:
		pv.choose2()

	default:
		fmt.Println("内容错误")
		pv.test()
	}
}

func (pv *phoneVerification) choose1() {
	fmt.Println("请输入验证码")
	fmt.Scanln(&pv.code)
	now := time.Now()
	
	if now.Before(pv.time2) {
		if pv.code == pv.codeNumber {
		    fmt.Println("登录成功！")
		    fmt.Println("验证码已失效")
		    pv.codeNumber = 0
	    } else {
		    fmt.Println("登录失败")
		    pv.test()
	    }
	}else {
		fmt.Println("验证码超过5分钟，已删除")
		pv.codeNumber = 0
		pv.test()
	}
}

func (pv *phoneVerification) choose2() {
	now := time.Now()
	currentDate := now.Format("2006-01-02")

	if  pv.lastDate != "" && pv.lastDate != currentDate {
		pv.times[pv.phoneNumber] = 5
		fmt.Println("新的一天，验证码可获取次数已重置为5次")
		pv.lastDate = currentDate
	}
	
    if !pv.saveTime.IsZero() {
		time1 := pv.saveTime.Add(1 * time.Minute)
		pv.time2 = pv.saveTime.Add(5 * time.Minute)
		
		if now.Before(time1) {
			fmt.Println("一分钟内无法再次获取验证码")
			pv.test() 
			return
		} else {
			pv.generateVerificationCode()
		} 
	} else {
		pv.generateVerificationCode()
	}
}

func (pv *phoneVerification) generateVerificationCode() {
	if pv.times[pv.phoneNumber] > 0 {
		pv.codeNumber = rand.Intn(900000) + 100000

		fmt.Printf("验证码为：%06d\n", pv.codeNumber)
		
		pv.times[pv.phoneNumber]--
		
		nowTime := time.Now()
		pv.saveTime = nowTime
		
		pv.test()
	} else {
		fmt.Println("一天内最多只能获取5次验证码哦")
		pv.test()
	}
}