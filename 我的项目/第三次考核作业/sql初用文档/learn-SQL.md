# 学习SQL命令


## 创建一个 school 数据库：

```SQL
CREATE DATABASE school;
```

## 在 school 数据库中创建一个 student 表：

```SQL
USE school;  

CREATE TABLE student (
   student_name VARCHAR(255) NOT NULL,
   id INT AUTO_INCREMENT PRIMARY KEY,
   student_id VARCHAR(10) NOT NULL,
   hometown VARCHAR(255) NULL,
   gender VARCHAR(1) NOT NULL
);
```

## 对 student_id 列建立索引：

```SQL
CREATE INDEX idx_name ON student(student_id);
```

## 向 student 表中添加11条数据，student_name 为 25 届研发新生的姓名，剩下的字段值随便编，然后对该表分别进行删除、更新、查找操作，查找要求使用到Where、Order By、Group By关键字：


- 添加：

```SQL
INSERT INTO school.student (student_name, id, student_id, hometown, gender)
VALUES ('傅立铭', 1, '8002125195', '江西省南昌市', '男');

INSERT INTO school.student (student_name, id, student_id, hometown, gender)
VALUES ('李咏嘉', DEFAULT, 'xxxxxxxxxx', 'xxx', '男');

INSERT INTO school.student (student_name, id, student_id, hometown, gender)
VALUES ('文孺屹', DEFAULT, 'xxxxxxxxxx', 'xxx', '男');
（同理再写8条）
```

- 更新：

```SQL
UPDATE school.student
SET student_name = 'FraiMing'
WHERE id = 1;
```

- 删除：

```SQL
DELETE FROM school.student
WHERE id = 1;
```

- 查找：

```SQL
SELECT *
FROM student
WHERE gender = '男'
ORDER BY id;

SELECT gender, COUNT(*)
FROM student
GROUP BY gender;
```
