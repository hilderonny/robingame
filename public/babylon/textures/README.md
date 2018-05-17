# Texture creation

The textures are created with http://cpetry.github.io/TextureGenerator-Online/. Normal maps ure created using http://cpetry.github.io/NormalMap-Online/. Following settings are used.

## Grass

### Texture map

|Property|Value|
|:----|:----|
|Texture type|PerlinNoise|
|Color1|#32ab22|
|Color2|#141c14|
|Type|PerlinNoise|
|Octaves|3|
|Scale|76|
|Persistence|1|
|Seed|1|
|Rotation|0|

### Normal map
The generated texture is used as heightmap source for normal generation.

|Property|Value|
|:----|:----|
|Strength|5|
|Level|8.1|
|Blur/Sharp|4|
|Filter|Sobel|

### Displacement map

|Property|Value|
|:----|:----|
|Contrast|0.41|
|Blur/Sharp|32|

Rendered with displacement setting 0.39 (height)

### Ambient occlusion map

|Property|Value|
|:----|:----|
|Strength|1|
|Mean|1|
|Range|1|
|Blur/Sharp|0|

### Specular map

|Property|Value|
|:----|:----|
|Strength|1|
|Mean|1|
|Range|1|
|Falloff|No|
