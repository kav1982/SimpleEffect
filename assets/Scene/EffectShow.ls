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
              "y": 13,
              "z": 20
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.25881904510252074,
              "w": 0.9659258262890683
            }
          },
          "orthographicVerticalSize": 10,
          "fieldOfView": 60,
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearFlag": 1,
          "clearColor": {
            "_$type": "Color",
            "r": 0.3921,
            "g": 0.5843,
            "b": 0.9294
          },
          "cullingMask": 2147483647,
          "normalizedViewport": {
            "_$type": "Viewport",
            "width": 1,
            "height": 1
          },
          "depthTextureFormat": 37
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
            },
            {
              "_$type": "77053a75-dfb0-4f47-8c2c-eff6a8a9472e",
              "scriptPath": "../src/Game/Engine/Editor/PhoneTestBtn.ts",
              "createBtn": {
                "_$ref": "n0yvlk7l"
              },
              "showHideBtn": {
                "_$ref": "vxs7dvus"
              },
              "switchBtn": {
                "_$ref": "dy2rihps"
              },
              "loadAllBtn": {
                "_$ref": "gpp85jxd"
              },
              "btnFullScreenTint": {
                "_$ref": "8p4eqdkm"
              },
              "btnNormalScreenTint": {
                "_$ref": "xi2o6ykd"
              },
              "btnTintColor": {
                "_$ref": "1w8ekpir"
              },
              "btnDesaturate": {
                "_$ref": "2r6pp4sm"
              },
              "urls": [
                "resourcesLib/effect/Prefab/CharFX/FX_11000003_b_skill01.lh",
                "resourcesLib/effect/Prefab/SceneFX/FX_scence_paopao_1_lit.lh"
              ],
              "urlShowText": {
                "_$ref": "1i4ulsj1"
              },
              "createPos": {
                "_$type": "Vector3"
              },
              "renderColor": {
                "_$type": "Color",
                "r": 0.05,
                "g": 0.15,
                "b": 0.45
              },
              "FadeTime": 0.5
            },
            {
              "_$type": "bba16cc9-cbfb-42da-8b10-d73509c1049d",
              "scriptPath": "../src/Game/Engine/GlobalShaderData.ts",
              "AutoFresh": false,
              "curveWorldSetting": {
                "_$type": "42ef2d25-72bf-4d2b-b4bf-3bfbdd52ddfb",
                "Plane": 0,
                "BlendSize": 6,
                "BlendOffset": 8,
                "DitherClipStart": 8,
                "DitherClipEnd": 9.5
              },
              "zhFogSetting": {
                "_$type": "8816bf65-fd56-4b0a-aa5a-00ca2da6dd98",
                "ZFogStart": null,
                "ZFogEnd": null,
                "ZHFogColor": {
                  "_$type": "Color",
                  "r": 0,
                  "g": 0,
                  "b": 0,
                  "a": 0
                },
                "HFogStart": null,
                "HFogEnd": null
              },
              "planeShadowSetting": {
                "_$type": "bfc67126-f8d7-4591-ba32-e5cdad262474",
                "PlaneShadowLightDir": {
                  "_$type": "Vector3",
                  "x": 1,
                  "y": 1,
                  "z": 1
                },
                "PlaneShadowColor": {
                  "_$type": "Color",
                  "r": 0,
                  "g": 0,
                  "b": 0,
                  "a": 0.4
                },
                "PlaneShadowPlane": 0.01
              },
              "bgCtrlSetting": {
                "_$type": "4388f388-9adc-47af-a795-086c81cfd349",
                "zFactor": 0.3,
                "yFactor": 0.3,
                "zStart": 2
              },
              "sceneTintSetting": {
                "_$type": "a70f809c-461f-4099-931c-194c09f73f30",
                "SceneTintColor": {
                  "_$type": "Color",
                  "r": 0.05,
                  "g": 0.15,
                  "b": 0.45
                },
                "SceneTintIntensity": 0,
                "SceneTintDesaturate": 0
              }
            }
          ]
        },
        {
          "_$id": "e3fb7fkx",
          "_$type": "Sprite3D",
          "name": "scene",
          "_$child": [
            {
              "_$id": "0fba40f5",
              "_$type": "Sprite3D",
              "name": "bg",
              "active": false,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "z": 1.8227707147598267
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 40,
                  "y": 40,
                  "z": 1
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "7e9b0d09-b83c-425d-adf1-3d319f026e38",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                }
              ]
            },
            {
              "_$id": "w0siqu6i",
              "_$type": "Sprite3D",
              "name": "ground",
              "active": false,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "y": -3.4088205742237285,
                  "z": 27.40302885027763
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": -0.7001091183647605,
                  "w": 0.714035869114793
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 40,
                  "y": 60,
                  "z": 1.0000000008897076
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "7e9b0d09-b83c-425d-adf1-3d319f026e38",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "sharedMaterials": [
                    {
                      "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                      "_$type": "Material"
                    }
                  ]
                }
              ]
            },
            {
              "_$id": "s412ytkc",
              "_$type": "Sprite3D",
              "name": "Plane",
              "active": false,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "y": 2.011894941329961,
                  "z": 34.19773314892142
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": 0.7071067811865475,
                  "w": 0.7071067811865476
                },
                "localScale": {
                  "_$type": "Vector3",
                  "x": 20,
                  "y": 20,
                  "z": 20
                }
              },
              "_$comp": [
                {
                  "_$type": "MeshFilter",
                  "sharedMesh": {
                    "_$uuid": "4a4afb22-ef83-40a2-a6a8-212a2d20c52f",
                    "_$type": "Mesh"
                  }
                },
                {
                  "_$type": "MeshRenderer",
                  "sharedMaterials": [
                    {
                      "_$uuid": "bbcfc7ff-21f8-47e0-ab77-24c82412f8bf",
                      "_$type": "Material"
                    }
                  ]
                }
              ]
            },
            {
              "_$id": "247m8jrn",
              "_$prefab": "24322aa8-0243-4a43-8a83-dad874801f08",
              "name": "SceneModel_10008",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": -49.87033,
                  "y": 0,
                  "z": 52.62986
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": 0,
                  "y": 0.9999999999999991,
                  "z": 0,
                  "w": 4.371138999999996e-8
                }
              },
              "_$child": [
                {
                  "_$override": "#10",
                  "transform": {
                    "localPosition": {
                      "_$type": "Vector3",
                      "x": -50.00000078031891,
                      "y": -95,
                      "z": 178.69999314488234
                    },
                    "localScale": {
                      "_$type": "Vector3",
                      "x": -4.847219,
                      "y": 5.605605,
                      "z": 2.625436
                    }
                  }
                },
                {
                  "_$override": "#12",
                  "active": true
                }
              ]
            }
          ]
        },
        {
          "_$id": "34qudz39",
          "_$type": "Sprite3D",
          "name": "Effect",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "y": 0.1,
              "z": 2.6
            }
          },
          "_$child": [
            {
              "_$id": "ugc3jv82",
              "_$prefab": "1ebee574-d042-4987-b9a4-8cd808a6b6e2",
              "name": "FX_1401902_attack",
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
      "name": "FPS",
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
      "_$id": "n0yvlk7l",
      "_$type": "Button",
      "name": "create",
      "x": 482,
      "y": 1077,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "生成",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "vxs7dvus",
      "_$type": "Button",
      "name": "showHide",
      "x": 482,
      "y": 1164,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "显隐",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "dy2rihps",
      "_$type": "Button",
      "name": "switch",
      "x": 19,
      "y": 1071,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "切换",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "gpp85jxd",
      "_$type": "Button",
      "name": "loadAll",
      "x": 18.999999999999996,
      "y": 1162.0000000000007,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "加载全部",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "8p4eqdkm",
      "_$type": "Button",
      "name": "btnFullScreenTint",
      "x": 19,
      "y": 1249.0000000000011,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "染色去饱和",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "xi2o6ykd",
      "_$type": "Button",
      "name": "btnNormalScreenTint",
      "x": 482.00000000000006,
      "y": 1249.0000000000011,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "恢复正常",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "1w8ekpir",
      "_$type": "Button",
      "name": "btnTintColor",
      "x": 482,
      "y": 1331.0000000000011,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "染色",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "2r6pp4sm",
      "_$type": "Button",
      "name": "btnDesaturate",
      "x": 19,
      "y": 1331.0000000000011,
      "width": 218,
      "height": 70,
      "_mouseState": 2,
      "skin": "res://900237c6-df32-4ae3-9005-b3faec72ca59",
      "label": "去饱和",
      "labelSize": 40,
      "labelBold": true,
      "labelAlign": "center",
      "labelVAlign": "middle"
    },
    {
      "_$id": "1i4ulsj1",
      "_$type": "Text",
      "name": "urlShowText",
      "x": 9,
      "y": 1357,
      "width": 701,
      "height": 201,
      "text": "当前Prefab:",
      "fontSize": 35,
      "color": "rgba(0, 0, 0, 1)",
      "bold": true,
      "align": "center",
      "valign": "middle",
      "wordWrap": true,
      "leading": 2
    }
  ]
}