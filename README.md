# hapi-basic-auth-demo

## School website example
You have been asked to set up a website for a school that will serve visitors, students and teachers. The site will contain some confidential information which you wish to keep secret. Visitors should not be able to see the students' or teachers' information, students should be able to see their own information and teachers should be able to see their own and students' information.

Hapi Basic Auth provides a quick way of setting up authentication with different levels of authorization designated for certain endpoints. In your website there are three endpoints with three different security levels, or 'auth strategies':

|Strategy|Endpoint  |File served |Validation function|
|---     |---       |---         |---                |
| -      | /        |index.html  |-                   |
| user   | /student |student.html|validateAsUser     |
| admin  | /teacher |teacher.html|validateAsAdmin    |

Have a look through the code to understand how the authentication strategies are configured and applied. Also used in the example code are [Bell](https://www.npmjs.com/package/bell), a module for interacting with the 3rd party authentication of some popular websites such as facebook and twitter, and [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie) which uses authentication.

## Summary

Hapi is all about configuration. The beauty of using these auth plug-ins is that the auth strategies for different endpoints are defined using a config object when `server.route()` is called. It makes seeing which strategies are applied to which endpoints very readable, a massive benefit for reviewing others' code or coming back to one of your own projects.
