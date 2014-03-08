changelog2
==========

changelog by Meteor

## What's this?

Micro blog system made by [Meteor](https://www.meteor.com/).  
([changelog](https://github.com/takuro/changelog) is Rails.)

## Feature
* Support Markdown.
* No Authenticate system.
* Max writer : 1
* Markdown file upload to add article.
* Image upload is nothing.(Probably, Flickr or Instagram uses?)
* Use [bootstrap](https://github.com/twbs/bootstrap) and [GreenMind](https://github.com/wakamsha/greenmind).

## Add article
1. Write a article on your favorite editor.
2. Save as Markdown file.  
FILE NAME : yyyymmdd_hhmm_url.md (e.g. 20140309_0426_getting-started-meteor.md )
3. Upload file to your server. Path is "approot/client/log".
4. Start server.
5. Access to "http://app.root/create_index".
6. Go to "http://app.root/"

## Author
Takuro Ishii ( [isitkr.org](http://isitkr.org/) )
