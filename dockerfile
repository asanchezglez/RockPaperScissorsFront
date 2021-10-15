FROM tomcat:9.0
ARG WAR_FILE=target/*.war
COPY ${WAR_FILE} /usr/local/tomcat/webapps/rps.war

