package main

import (
	"net/http"

	docs "anh.to/server/docs"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

const API_PREPEND = "/api/v1"

type url struct {
	Id       string `json:"id"`
	ShortUrl string `json:"shortUrl"`
	LongUrl  string `json:"longUrl"`
}

var examples = []url{
	{Id: "0", ShortUrl: "a", LongUrl: "https://aaanh.com"},
	{Id: "1", ShortUrl: "b", LongUrl: "https://aka.ms/nohello"},
	{Id: "2", ShortUrl: "c", LongUrl: "https://github.com/aaanh"},
}

// @BasePath /api/v1

// @Summary Get all URL pairs
// @Schemes
// @Description Query the database and forward all URL pairs to the requester
// @Tags GET
// @Accept json
// @Produce json
// @Success 200 {[]object} getAllUrls
// @Router /urls [get]
func getAllUrls(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, examples)
}

// @Summary Get long URL from short URL query param
// @Schemes
// @Description Query the database and forward all URL pairs to the requester
// @Tags GET
// @Accept json
// @Produce json
// @Success 200 {object} getAllUrls
// @Router /url/shortUrl [get]
func getLongUrl(c *gin.Context) {
	shortUrl := c.Param("shortUrl")
	for _, a := range examples {
		if a.ShortUrl == shortUrl {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Invalid URL"})
}

func main() {
	router := gin.Default()

	// Initialize docs
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1 := router.Group("/api/v1")
	{
		path_group := v1.Group("/urls")
		{
			path_group.GET("/urls", getAllUrls)
		}
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	v1.GET("/urls", getAllUrls)
	v1.GET("/url/:shortUrl", getLongUrl)

	router.Run(":8080")
}
