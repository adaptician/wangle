# Wangle

## Quickstart

Welcome to Wangle.

This PoC was built with the ASP.NET Boilerplate. The original README instructions are present after this section.

To get Wangle up and running, there are only a few steps to follow:

1. The project uses a SQL Server database. Please ensure that you have SQL Server installed.
2. Based on the database connection string in Wangle.Web.Host/appsettings.json, please created a SQL database with the name matching your conneciton string.
3. Once the new database has been created, run the Wangle.Migrator project:
	- this will open a terminal
	- when prompted to "migrate all tenants Y/N" reply with "Y"
	- the tables as per the boilerplate will be created and seeded as necessary
	- included in the code-first migrations are some setup files for the Wangle project.
4. Run the backend project from your IDE:
	- Wangle.Web.Host is the startup project
	- Restore NuGet packages
	- Build and run the project
5. Run the frontend project from your IDE:
	- Wangle.Web.Host/app contains the Angular 17 frontend
	- NodeJS ^18.13.0 || ^20.9.0 is required for Angular 17 - please install it before running the frontend project
	- Install node modules using `yarn install` || `npm install`
	- The package.json contain a run script:
		- run the project using `yarn run start` || `npm run start`
6. Check your appsettings / execution output for the correct ports (defaults backend: localhost:44311 and frontend: localhost:4200)
	- open the frontend URL in your browser
	- you should see a login page
7. The PoC was implemented at Tenant level:
	- Click on the link to change the current Tenant
	- Enter the text "Default" into the input (the default tenant will have been created during database seeding)
8. Login using the credentials
	- Username: admin
	- Password: 123qwe
9. Navigate to the Simulations menu item
	- A test scene was seeded via the migrations
10. Click the "View" button to enter the virtual classroom

## Virtual Classroom Overview

The virtual classroom was created with a shared scene (top) and a personal scene (bottom) for personal exploration.

### Controls
Orbit controls are available for navigation:
- Click and drag to orbit the focal area of the scene.
- Scroll to zoom.
- SHIFT + Drag will pan.

### Adding Objects 

Use the buttons to add objects to the scene.

### Perspective Sharing

Multiple users can join a virtual classroom at once.

Press the Play button to cast your perspective to all other users in the group. If someone else is casting, you will see what they see.

Text-based chat will be broadcast to all users in the virtual classroom.

# Enjoy!
I hope this project is helpful to you, or at the very least, fun to play with.

# Important

Issues of this repository are tracked on https://github.com/aspnetboilerplate/aspnetboilerplate. Please create your issues on https://github.com/aspnetboilerplate/aspnetboilerplate/issues.

# Introduction

This is a template to create **ASP.NET Core MVC / Angular** based startup projects for [ASP.NET Boilerplate](https://aspnetboilerplate.com/Pages/Documents). It has 2 different versions:

1. [ASP.NET Core MVC & jQuery](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Core) (server rendered multi-page application).
2. [ASP.NET Core & Angular](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Angular) (single page application).
 
User Interface is based on [AdminLTE theme](https://github.com/ColorlibHQ/AdminLTE).
 
# Download

Create & download your project from https://aspnetboilerplate.com/Templates

# Screenshots

#### Sample Dashboard Page
![](_screenshots/module-zero-core-template-ui-home.png)

#### User Creation Modal
![](_screenshots/module-zero-core-template-ui-user-create-modal.png)

#### Login Page

![](_screenshots/module-zero-core-template-ui-login.png)

# Documentation

* [ASP.NET Core MVC & jQuery version.](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Core)
* [ASP.NET Core & Angular  version.](https://aspnetboilerplate.com/Pages/Documents/Zero/Startup-Template-Angular)

# License

[MIT](LICENSE).


