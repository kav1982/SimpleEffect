{
  "_$ver": 1,
  "_$id": "gwzxgzxb",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "_$child": [
    {
      "_$id": "n9gjxcltvl",
      "_$type": "Scene3D",
      "name": "Scene3D",
      "skyRenderer": {
        "meshType": "dome",
        "material": {
          "_$uuid": "793cffc6-730a-4756-a658-efe98c230292",
          "_$type": "Material"
        }
      },
      "ambientColor": {
        "_$type": "Color",
        "r": 0.424308,
        "g": 0.4578516,
        "b": 0.5294118
      },
      "fogStart": 0,
      "fogEnd": 300,
      "fogDensity": 0.01,
      "fogColor": {
        "_$type": "Color",
        "r": 0.5,
        "g": 0.5,
        "b": 0.5
      },
      "lightmaps": [],
      "componentElementDatasMap": {
        "_$type": "Record"
      },
      "_$child": [
        {
          "_$id": "6jx8h8bvc6",
          "_$type": "Camera",
          "name": "Main Camera",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0.45995,
              "y": 0.30976,
              "z": 15
            }
          },
          "orthographic": true,
          "orthographicVerticalSize": 2,
          "fieldOfView": 60,
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearColor": {
            "_$type": "Color",
            "r": 0,
            "g": 0,
            "b": 0,
            "a": 0
          },
          "cullingMask": 2147483647,
          "normalizedViewport": {
            "_$type": "Viewport",
            "width": 1,
            "height": 1
          },
          "depthTextureFormat": 37,
          "renderTarget": {
            "_$uuid": "82f6be22-646d-43d0-83b4-b922eb027ff4",
            "_$type": "RenderTexture"
          }
        },
        {
          "_$id": "mgkrwvnu",
          "_$type": "Sprite3D",
          "name": "Mgr",
          "_$comp": [
            {
              "_$type": "d6fe8d2c-0198-4310-8963-e06e273872d8",
              "scriptPath": "../src/Game/Engine/Editor/RenderParamShow.ts",
              "drawCallText": {
                "_$ref": "y33hg8rm"
              }
            },
            {
              "_$type": "d85aaf4e-626d-4987-b47a-1cf48232ec95",
              "scriptPath": "../src/Game/Engine/Editor/EditorSceneSet.ts",
              "camera": {
                "_$ref": "6jx8h8bvc6"
              }
            }
          ]
        },
        {
          "_$id": "y7rplyl4",
          "_$prefab": "a44dc79c-bb20-42fd-a77c-ff581363418b",
          "name": "UIModelBg",
          "active": false,
          "layer": 0,
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0,
              "y": 0,
              "z": -500
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": 0,
              "y": 0,
              "z": 0,
              "w": 1
            },
            "localScale": {
              "_$type": "Vector3",
              "x": 2,
              "y": 2,
              "z": 2
            }
          }
        },
        {
          "_$id": "gh4s6fua",
          "_$type": "Sprite3D",
          "name": "UI_Effect",
          "transform": {
            "localScale": {
              "_$type": "Vector3",
              "x": 0.8,
              "y": 0.8,
              "z": 0.8
            }
          },
          "_$child": [
            {
              "_$id": "1wyojs02",
              "_$prefab": "54ab41c2-d17b-4325-9089-069a14aad0e9",
              "name": "62000712_UI",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 0,
                  "y": 0,
                  "z": 0
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": 0,
                  "y": 0,
                  "z": 0,
                  "w": 1
                }
              }
            }
          ]
        }
      ]
    },
    {
      "_$id": "y33hg8rm",
      "_$type": "Text",
      "name": "Text",
      "x": 45,
      "y": 7,
      "width": 643,
      "height": 153,
      "text": "DrawCall:",
      "fontSize": 60,
      "color": "rgba(0, 0, 0, 1)",
      "bold": true,
      "valign": "middle",
      "leading": 2
    },
    {
      "_$id": "u7j94yq2",
      "_$type": "Sprite",
      "name": "UIBg",
      "x": -218,
      "y": -13,
      "width": 512,
      "height": 271,
      "scaleX": 2.3,
      "scaleY": 7,
      "texture": {
        "_$uuid": "1ee4797f-5557-461d-989a-33e3b372e1ff",
        "_$type": "Texture"
      }
    },
    {
      "_$id": "pu0g4svm",
      "_$type": "Image",
      "name": "RTShow",
      "width": 720,
      "height": 720,
      "scaleX": 2,
      "scaleY": 2,
      "skin": "res://82f6be22-646d-43d0-83b4-b922eb027ff4",
      "color": "#ffffff"
    }
  ]
}