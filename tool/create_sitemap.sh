#!/bin/sh

################## WARNING ##################
# DELETE THIS FILE FROM PRODUCTION SERVER!! #
################## WARNING ##################

log_dir_path="../public/log/"
header_path="header.xml"
footer_path="footer.xml"
sitemap_file_path="sitemap.xml"

url_base="http://isitkr.org/log/"

TZD="+09:00" # Japan
changefreq="always"
default_priority="0.5"

cat $header_path > $sitemap_file_path

for md_file in ${log_dir_path}*.md
do

  # get log title
  #title=`cat ${md_file} | grep "^\# "`

  # remove \#
  title=`echo $title | sed -e "s/^\# //"`

  # remove directory path and extension
  file_name=`basename $md_file .md`

  # get date tile
  year=`echo $file_name | sed -e "s/^\([0-9]\{4\}\).*/\1/"`
  month=`echo $file_name | sed -e "s/^[0-9]\{4\}\([0-9]\{2\}\).*/\1/"`
  day=`echo $file_name | sed -e "s/^[0-9]\{6\}\([0-9]\{2\}\).*/\1/"`
  hour=`echo $file_name | sed -e "s/^[0-9]\{8\}_\([0-9]\{2\}\).*/\1/"`
  min=`echo $file_name | sed -e "s/^[0-9]\{8\}_[0-9]\{2\}\([0-9]\{2\}\).*/\1/"`

  lastmod="${year}-${month}-${day}T${hour}:${min}${TZD}"

  # remove date and time
  file_name=`echo $file_name | sed -e "s/^[0-9]\{8\}_[0-9]\{4\}_//"`

  # remove tag
  file_name=`echo $file_name | sed -e "s/_.\+$//"`

  echo "<url>" >> $sitemap_file_path
  echo "<loc>${url_base}${file_name}</loc>" >> $sitemap_file_path
  echo "<lastmod>${lastmod}</lastmod>" >> $sitemap_file_path
  echo "<changefreq>${changefreq}</changefreq>" >> $sitemap_file_path
  echo "<priority>${default_priority}</priority>" >> $sitemap_file_path
  echo "</url>" >> $sitemap_file_path
done

cat $footer_path >> $sitemap_file_path
