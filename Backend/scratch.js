import axios from 'axios';
axios.get('http://localhost:5001/api/universities').then(res => {
  const unis = res.data.data;
  console.log("Unis:", unis.map(u => ({ id: u._id, code: u.UniversityCode, name: u.University })));
  
  axios.get('http://localhost:5001/api/courses').then(cRes => {
    const courses = cRes.data.data;
    console.log("Courses:", courses.map(c => ({ id: c._id, code: c.UniversityCode, name: c.CourseName })));
  });
}).catch(console.error);
