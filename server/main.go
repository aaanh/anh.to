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
// @Success 200 {object} getAllUrls
// @Router /urls [get]
func getAllUrls(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, examples)
}

func main() {
	router := gin.Default()

	// Initialize docs
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1 := router.Group("/api/v1")
	{
		eg := v1.Group("/urls")
		{
			eg.GET("/urls", getAllUrls)
		}
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	router.Run(":8080")
}
