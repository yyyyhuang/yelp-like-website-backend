# 2% Milk Team - Yelp-Like Restaurant Recommendation Website
# Team members: Yingjie Huang, Wanqing Guo

**Iteration 2**
1. Progress
    - Data:
        - procress raw data JSON file, upload photos to AWS S3, connect AWS S3 url to photo and restaurant database, upload local database to MongoDB Atlas
    - Backend:
        - Set up register and login controller and DAO
        - Add photo controller to get all photos for each restaurant
2. Members' contribution
    - Yingjie Huang:
        - Implement photo controllers and DAO
    - Wanqing Guo:
        - Process raw dataset, connect AWS S3 contents to database, deploy database to cloud
        - implement register and login
        - update README

3. Screenshots of progress
    <img width="1440" alt="atlas_1" src="/screenshot/atlas_1.png">
    <img width="1440" alt="atlas_2" src="/screenshot/atlas_2.png">


**Iteration 1**

1. Progress
    - In the iteration 1, our group has designed the workflow and implemented most of the backend. We set up routings, built the APIs to handle HTTP requests, and created CRUD operations for each microservices. We also designed database schemas with MongoDB and deployed sample data onto Atlas.
2. Members' contribution
    - Yingjie Huang:
        - designed backend and database schemas
        - implemented data access objects(DAOs)
    - Wanqing Guo:
        - designed backend and database schemas
        - set up routings and implemented controllers for high level data access
    
3. Issues
    - Our group needs to set up cload storage on AWS for photo files and modify photo data access object and controller in the next iteration. 

4. Screenshots of progress
    <img width="1440" alt="mongodb setup" src="/screenshot/mongoDB_setup.png">
    <img width="1440" alt="database example" src="/screenshot/database_example.png">