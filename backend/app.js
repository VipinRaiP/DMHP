const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jsonGroupBy = require("json-groupby");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

/**********************************************************************************************************************************
*  Connecting to DB 
* 
**********************************************************************************************************************************/

app.get("/", function (req, res, next) {
  res.json({
    message: "Working I am fine"
  });
})

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

con.connect(function (err) {
  if (err) console.log(err);
  console.log("connected");
});

sql = "use DMH";
con.query(sql, function (err, res) {
  if (err) console.log(err);
  console.log(res);
});

/****************************************************************************************************************** 
 *
 * API to query data about all districts (Monthly, Annually, Quarterly)
 *  
 ******************************************************************************************************************/

app.post("/getAlcoholDataAllDistMonthly", (req, res) => {

  var year = req.body.year;

  sql = "select m.Month,m.DistrictId, d.District,d.Population,\

      (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Total Cases`\
      from (SELECT CASE \
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
      END as Month,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female \
      from Clinical_Data \
      where year(ReportingMonthyear)=?) m, Districts d \
      where m.DistrictId = d.DistrictId \
      group by m.Month,m.DistrictId,d.Population \
      order by Month,`Total Cases`";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    if (response != null) {
      var responseGrouped = jsonGroupBy(response, ['Month']);
      res.json(responseGrouped);
    }
    else
      res.json(response);
  });
})

app.post("/getSuicideDataAllDistMonthly", (req, res) => {
  var year = req.body.year;
  console.log(year);
  sql = "select m.Month,d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Total Cases`\
          from (SELECT CASE WHEN MONTH(ReportingMonthyear)=1 THEN 1 \
          WHEN MONTH(ReportingMonthyear)=2 THEN 2 \
          WHEN MONTH(ReportingMonthyear)=3  THEN 3 \
          WHEN MONTH(ReportingMonthyear)=4 THEN 4 \
          WHEN MONTH(ReportingMonthyear)=5 THEN 5 \
          WHEN MONTH(ReportingMonthyear)=6  THEN 6 \
          WHEN MONTH(ReportingMonthyear)=7 THEN 7 \
          WHEN MONTH(ReportingMonthyear)=8 THEN 8 \
          WHEN MONTH(ReportingMonthyear)=9  THEN 9 \
          WHEN MONTH(ReportingMonthyear)=10 THEN 10 \
          WHEN MONTH(ReportingMonthyear)=11 THEN 11 \
          WHEN MONTH(ReportingMonthyear)=12  THEN 12 \
          END as Month,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases \
          from Clinical_Data \
          where year(ReportingMonthyear)=? ) m, Districts d \
          where m.DistrictId = d.DistrictId \
          group by m.Month,d.DistrictId,d.Population \
          order by m.Month,`Total Cases`";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Month']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  sql = "select q.Quarter,q.DistrictId,d.District,d.Population,\

          (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as `Total Cases` \
           from (SELECT CASE \
                WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 \
                WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
                WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
                WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
                END as Quarter,DistrictId,new_alcohal_male,old_alcohal_male,new_alcohal_female,\
                old_alcohal_female \
                from Clinical_Data \
                where year(ReportingMonthyear)=?) q , Districts d\
                where q.DistrictId = d.DistrictId \
                group by q.Quarter,q.DistrictId,d.Population\
                order by q.Quarter,`Total Cases`";


  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getSuicideDataAllDistQuart", (req, res) => {
  var year = req.body.year;
  console.log(year);
  sql = "select q.Quarter,d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(new_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)) as `Total Cases`\
          from (SELECT CASE WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1  \
          WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 \
          WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 \
          WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 \
          END as Quarter,DistrictId,old_male_suicidecases,new_male_suicidecases,old_female_suicidecases,new_female_suicidecases\
          from Clinical_Data where year(ReportingMonthyear)=?) q,Districts d \
          where q.DistrictId = d.DistrictId  \
          group by q.Quarter,d.DistrictId,d.Population \
          order by q.Quarter,`Total Cases`";

  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    var responseGrouped = jsonGroupBy(response, ['Quarter']);
    res.json(responseGrouped);
  });
})

app.post("/getAlcoholDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  console.log(year)
  sql = "select m.DistrictId, d.District,d.Population,\

          (sum(old_alcohal_male)+sum(new_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)) as `Total Cases` \
          from Clinical_Data m,Districts d\
          where year(ReportingMonthyear)=? and m.DistrictId = d.DistrictId\
          group by m.DistrictId,d.Population \
          order by `Total Cases`  "

  con.query(sql, [year], function (err, response) {
    console.log(sql)
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataAllDistAnnually", (req, res) => {
  var year = req.body.year;
  sql = "select d.DistrictId,d.District,d.Population,\
          (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_male_suicidecases)) as `Total Cases` \
          from Clinical_Data m, Districts d \
          where year(ReportingMonthyear)=? and m.DistrictId=d.DistrictId\
          group by m.DistrictId,d.Population \
          order by `Total Cases`";
  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/*********************************************************************************************************************************
 *  Map APIs
 * 
 *********************************************************************************************************************************/

app.post("/getAlcoholDataMonthlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,
  MONTH(c.ReportingMonthyear) as month ,
  sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as 'Total Cases' 
  from Clinical_Data c , Districts d  
  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=?
  group by c.ReportingMonthyear`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholDataQuarterlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select Quarter,District,
  (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as 'Total Cases' 
   from (SELECT CASE 
        WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
        END as Quarter,c.DistrictId,c.new_alcohal_male,c.old_alcohal_male,c.new_alcohal_female,
        c.old_alcohal_female , d.District 
        from Clinical_Data c , Districts d 
        where d.DistrictId = c.DistrictId and d.District=? and year(c.ReportingMonthyear)=? ) q 
        group by Quarter`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholDataYearlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,YEAR(c.ReportingMonthyear) as Year ,
        sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) as 'Total Cases' 
        from Clinical_Data c , Districts d  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=? 
        group by YEAR(c.ReportingMonthyear)`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataMonthlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,
  MONTH(c.ReportingMonthyear) as month ,
  sum(c.old_male_suicidecases)+sum(c.old_female_suicidecases)+sum(c.new_male_suicidecases)+sum(c.new_female_suicidecases) as 'Total Cases' 
  from Clinical_Data c , Districts d  
  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=?
  group by c.ReportingMonthyear`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataQuarterlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select Quarter,District,
  (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_male_suicidecases)+sum(new_female_suicidecases)) as 'Total Cases' 
   from (SELECT CASE 
        WHEN MONTH(ReportingMonthYear)>=1 and MONTH(ReportingMonthYear)<=3 THEN 1 
        WHEN MONTH(ReportingMonthYear)>=4 and MONTH(ReportingMonthYear)<=6 THEN 2 
        WHEN MONTH(ReportingMonthYear)>=7 and MONTH(ReportingMonthYear)<=9 THEN 3 
        WHEN MONTH(ReportingMonthYear)>=10 and MONTH(ReportingMonthYear)<=12 THEN 4 
        END as Quarter,c.DistrictId,c.old_male_suicidecases,c.old_female_suicidecases,c.new_male_suicidecases,
        c.new_female_suicidecases , d.District 
        from Clinical_Data c , Districts d 
        where d.DistrictId = c.DistrictId and d.District=? and year(c.ReportingMonthyear)=? ) q 
        group by Quarter`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getSuicideDataYearlyPerDistrictByName", (req, res) => {
  var year = req.body.year;
  var district = req.body.district;
  sql = `select d.District as District ,YEAR(c.ReportingMonthyear) as Year ,
        sum(c.old_male_suicidecases)+sum(c.old_female_suicidecases)+sum(c.new_male_suicidecases)+sum(c.new_female_suicidecases) as 'Total Cases' 
        from Clinical_Data c , Districts d  where d.DistrictId = c.DistrictId and d.District=? and YEAR(c.ReportingMonthyear)=? 
        group by YEAR(c.ReportingMonthyear)`;
  con.query(sql, [district, year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

app.post("/getAlcoholYearlyDistrictforMap", (req, res) => {
  var year = req.body.year;
  sql = "select d.District as Districtid ,year(c.ReportingMonthyear) ,sum(c.new_alcohal_male)+sum(c.new_alcohal_female)+sum(c.old_alcohal_male)+sum(c.old_alcohal_female) \
  as total_alcohol_cases\
  from Clinical_Data c , Districts d  where d.DistrictId = c.Districtid and year(c.ReportingMonthyear)=?\
  group by year(c.ReportingMonthyear) ,d.District order by total_alcohol_cases";
  con.query(sql, [year], function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  });
})

/******************************************************************************************************************************
 * 
 * Card api
 * 
 * 
 ******************************************************************************************************************************/

app.get("/getAlcoholCasesCurrentYear", (req, res) => {
  var year = 2018;
  /*sql = `select d.district ,sum(new_alcohal_male)+sum(new_alcohal_female)+sum(old_alcohal_male)+sum(old_alcohal_female) as 'Total Cases'
  from Clinical_Data c , Districts d where d.Districtid = c.Districtid
  group by d.district order by d.district ;`;*/

  sql = `select m.Month,
      (sum(old_alcohal_male)+sum(old_alcohal_female)+sum(new_alcohal_female)+sum(new_alcohal_male)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,new_alcohal_male,old_alcohal_male,new_alcohal_female,old_alcohal_female 
      from Clinical_Data 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;

  con.query(sql, year, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  })
});

app.get("/getSuicideCasesCurrentYear", (req, res) => {
  var year = 2018;
  /*sql = `select d.district ,sum(new_male_suicidecases)+sum(old_male_suicidecases)+sum(new_female_suicidecases)+sum(old_female_suicidecases) as 'Total Cases'
  from Clinical_Data c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
  group by d.district order by d.district ;`;*/

  sql = `select m.Month,
  (sum(old_male_suicidecases)+sum(old_female_suicidecases)+sum(new_female_suicidecases)+sum(new_male_suicidecases)) as 'Total Cases'
  from (SELECT CASE 
  WHEN MONTH(ReportingMonthyear)=1 THEN 1 
  WHEN MONTH(ReportingMonthyear)=2 THEN 2 
  WHEN MONTH(ReportingMonthyear)=3  THEN 3 
  WHEN MONTH(ReportingMonthyear)=4 THEN 4 
  WHEN MONTH(ReportingMonthyear)=5 THEN 5 
  WHEN MONTH(ReportingMonthyear)=6  THEN 6 
  WHEN MONTH(ReportingMonthyear)=7 THEN 7 
  WHEN MONTH(ReportingMonthyear)=8 THEN 8 
  WHEN MONTH(ReportingMonthyear)=9  THEN 9 
  WHEN MONTH(ReportingMonthyear)=10 THEN 10 
  WHEN MONTH(ReportingMonthyear)=11 THEN 11 
  WHEN MONTH(ReportingMonthyear)=12  THEN 12 
  END as Month,new_male_suicidecases,old_male_suicidecases,new_female_suicidecases,old_female_suicidecases 
  from Clinical_Data 
  where year(ReportingMonthyear)=?) m 
  group by m.Month
  order by Month,'Total Cases'`;

  con.query(sql, year, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  })
});

app.get("/getSMDCasesCurrentYear", (req, res) => {
  var year = 2018;
  /*sql = `select d.district ,sum(new_smd_male)+sum(new_smd_female)+sum(old_smd_male)+sum(old_smd_female)  as 'Total Cases'
    from Clinical_Data c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
    group by d.district order by d.district ;`;*/
  sql = `select m.Month,
      (sum(old_smd_male)+sum(old_smd_female)+sum(new_smd_female)+sum(new_smd_male)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,old_smd_male,old_smd_female,new_smd_female,new_smd_male 
      from Clinical_Data 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;
  con.query(sql, year, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  })
});

app.get("/getCMDCasesCurrentYear", (req, res) => {
  var year = 2018;
  /*sql = `select d.district ,sum(new_cmd_male)+sum(new_cmd_female)+sum(old_cmd_male)+sum(old_cmd_female) as 'Total Cases'
  from Clinical_Data c , Districts d where d.Districtid = c.Districtid and Year(ReportingMonthYear) = ?
  group by d.district order by d.district ;`;*/
  sql = `select m.Month,
      (sum(old_cmd_male)+sum(old_cmd_female)+sum(new_cmd_male)+sum(new_cmd_female)) as 'Total Cases'
      from (SELECT CASE 
      WHEN MONTH(ReportingMonthyear)=1 THEN 1 
      WHEN MONTH(ReportingMonthyear)=2 THEN 2 
      WHEN MONTH(ReportingMonthyear)=3  THEN 3 
      WHEN MONTH(ReportingMonthyear)=4 THEN 4 
      WHEN MONTH(ReportingMonthyear)=5 THEN 5 
      WHEN MONTH(ReportingMonthyear)=6  THEN 6 
      WHEN MONTH(ReportingMonthyear)=7 THEN 7 
      WHEN MONTH(ReportingMonthyear)=8 THEN 8 
      WHEN MONTH(ReportingMonthyear)=9  THEN 9 
      WHEN MONTH(ReportingMonthyear)=10 THEN 10 
      WHEN MONTH(ReportingMonthyear)=11 THEN 11 
      WHEN MONTH(ReportingMonthyear)=12  THEN 12 
      END as Month,new_cmd_male,old_cmd_male,new_cmd_female,old_cmd_female
      from Clinical_Data 
      where year(ReportingMonthyear)=?) m 
      group by m.Month
      order by Month,'Total Cases'`;
  con.query(sql, year, function (err, response) {
    if (err) console.log(err);
    console.log(response);
    res.json(response);
  })
});



module.exports = app;