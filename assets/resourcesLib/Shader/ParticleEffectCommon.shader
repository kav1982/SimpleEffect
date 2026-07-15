Shader3D Start
{
    type:Shader3D
    name: "ParticleEffectCommon"
    enableInstancing:true,
    supportReflectionProbe:false,
    uniformMap:{

        基本信息 : {type:"Group",options:{members:["u_Tintcolor~isUIEffect"]},serializable:false},
        u_AlphaTestValue: { type: Float, tips:"透明度裁切值",range:[0,1],default: 0.5 },
        u_Tintcolor: { type: Color, tips:"基本颜色",default: [1, 1, 1, 1], block: unlit },
        u_TintcolorStrength: { type: Float,tips:"基本颜色强度",default:1 },
        u_TilingOffset: { type: Vector4, tips:"主帖图Tiling",default: [1, 1, 0, 0], block: unlit },
        u_texture: { type: Texture2D, tips:"主贴图" },
        _AlbedoTextureUVAnim : {type: Vector4,caption:"主贴图参数" ,tips:"[ XY:主帖图UV动画 ]   [ Z:主帖图旋转角度(0-360度) ]",default: [0, 0, 0, 0]},
        CurveWorld: {type:Bool,caption:"曲面世界顶点变换",default:true},
        isUIEffect: {type:Bool,caption:"UI特效",tips:"有背板的Additive模式特效不勾选此选项",default:false},
        
        扰动 : {type:"Group",options:{members:["_DistortMap~_DistortParam"]},serializable:false},
        _DistortMap: {type: Texture2D, tips:"扰动贴图",default: "grey"},
        _AlbedoReceiveDistort: { type: Bool, tips:"主贴图受扰动影响",default: true }
        _DistortParam : {type: Vector4,
        tips:"[ XY:扰动UV动画 ]  [ Z:扰动强度 ]  [ W:扰动图片缩放 ]",
        default: [1, 1, 0.5, 1]}

        溶解 : {type:"Group",options:{members:["_DissolveMap~_DissolveParam2"]},serializable:false},
        _DissolveMap : {type: Texture2D, tips:"溶解贴图",default: "white"},
        _DissolveReceiveDistort: { type: Bool, tips:"溶解受扰动影响",default: true }
        _DissolveEdgeColor : {type: Color, tips:"溶解边缘颜色",default:[1, 1, 1, 1]},
        _DissolveParam : {type: Vector4, 
        tips:"[ XY:溶解UV动画 ]  [ Z:溶解强度 ]  [ W:溶解柔和 ]",
        default: [0, 0, 0.5, 0.5]}, 
        _DissolveParam2 : {type: Vector4, 
        tips:"[ X:溶解边缘范围 ]  [ Y:溶解边缘柔和 ] [ ZW:溶解贴图XY缩放 ]",
        default: [0, 0, 1, 1]}, 

        遮罩 : {type:"Group",options:{members:["_MaskMap~_MaskUVAnim"]},serializable:false},
        _MaskMap : {type: Texture2D, tips:"遮罩贴图",default: "white"},
        _MaskChannelA : {type:Bool, tips:"遮罩使用A通道，(默认R通道)",default:false},
        _MaskReceiveDistort : {type: Bool,tips:"遮罩受扰动影响",default:false},
        _MaskTilingOffset: { type: Vector4, tips:"Mask帖图Tiling",default: [1, 1, 0, 0]},
        _MaskUVAnim : {type: Vector2, tips:"遮罩UV动画",default:[0,0]},
        
        雾效参数 : {type:"Group",options:{members:["_ReceiveFog~_AdditiveFog"]},serializable:false},
        _ReceiveFog :  {type:Bool , caption:"接收雾效",tips:"贴图无A通道且模式为Additive时不要勾选",default:true},
        _AdditiveFog :  {type:Bool , caption:"Additive雾效",tips:"接收雾效且物体混合模式为Additive时勾选",default:false},

        _EnableSoftParticle : {type : Bool, caption:"是否受软粒子效果", default:false},
        _SoftParticleStartHeight : {type : Float, caption:"软粒子生效的开始高度",default:0.5},
        _SoftParticleEndHeight : {type: Float, caption:"软粒子生效的终止高度",default:-1},
        _Softness : {type: Float, caption:"透明度调节因子",default:2},
    },
    attributeMap: {
        a_DirectionTime : Vector4,
        a_MeshPosition : Vector3,
        a_MeshColor : Vector4,
        a_MeshTextureCoordinate : Vector2,
        a_ShapePositionStartLifeTime : Vector4,
        a_CornerTextureCoordinate: Vector4,
        a_StartColor : Vector4, 
        a_EndColor : Vector4, 
        a_StartSize : Vector3,
        a_StartRotation0 : Vector3,
        a_StartSpeed : Float,
        a_Random0 : Vector4,
        a_Random1 : Vector4,
        a_SimulationWorldPostion : Vector3,
        a_SimulationWorldRotation : Vector4,
        a_SimulationUV: Vector4
    },
    defines: {
        //ENABLEVERTEXCOLOR: { type: bool, default: false }
        EnableDistort: { type: bool, tips:"开启扰动",default: false },
        EnableDissolve: { type: bool, tips:"开启溶解",default: false },
        EnableMask: { type: bool, tips:"开启遮罩",default: false },
        //CURVE_WORLD: {type:bool,tips:"曲面世界顶点变换",default:true},
        //ZHFOG: { type:bool,tips:"接受全局雾效",default: false},
        //ADDITIVEFOG: { type:bool,tips:"开启雾效且物体混合模式为Additive",default: false},
    }
    shaderPass:[ 
        {
            pipeline:Forward,
            VS:ParticleVS,
            FS:ParticleFS  
        }
    ]
}
Shader3D End
 
GLSL Start 
#defineGLSL ParticleVS

    #define SHADER_NAME ParticleVS

    #include "Camera.glsl";
    #include "particleShuriKenSpriteVS.glsl";
    #include "Scene.glsl";
    //#include "SceneFogInput.glsl";
    #include "Math.glsl";
    #include "MathGradient.glsl";
    #include "Color.glsl";

    #include "./ShaderLibrary/EffectCommonInput.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";


    varying vec4 v_MeshColor;
    varying vec3 worldPosXYZ;

    varying vec4 v_Color;
    varying vec4 v_TextureCoordinate;

    #ifdef EnableDissolve
    varying vec2 v_dissolveUV;
    #endif

    #ifdef EnableDistort
    varying vec2 v_distortUV;
    #endif

    //#ifdef ZHFOG
    //varying vec2 v_fogParam;
    //#endif

    uniform float u_shape;
    uniform int u_sizeoverlifetime_step;
    uniform int u_texturesheetanimation_step;
    uniform int u_billboard_step;
    uniform int u_randomcolor_step;
    uniform int u_velocity_step;
    uniform int u_rotation_step;

    //修改这里剔除没有用到的光照函数，增加粒子的编译速度
    vec2 TransformUV(vec2 texcoord, vec4 tilingOffset)
    {
        vec2 transTexcoord = vec2(texcoord.x, texcoord.y - 1.0) * tilingOffset.xy + vec2(tilingOffset.z, -tilingOffset.w);
        transTexcoord.y += 1.0;
        return transTexcoord;
    }

    // drag
    vec3 getStartPosition(vec3 startVelocity, float age, vec3 dragData)
    {
        vec3 startPosition;
        float lasttime = min(startVelocity.x / dragData.x, age);
        startPosition = lasttime * (startVelocity - 0.5 * dragData * lasttime);
        return startPosition;
    }

    
    vec4 computeParticleColor(in vec4 color, in float normalizedAge)
    {
        if (u_randomcolor_step == 1) {
           // 预计算颜色插值
            vec4 color1 = getColorFromGradient(u_ColorOverLifeGradientAlphas, u_ColorOverLifeGradientColors, normalizedAge, u_ColorOverLifeGradientRanges);
            vec4 color2 = getColorFromGradient(u_MaxColorOverLifeGradientAlphas, u_MaxColorOverLifeGradientColors, normalizedAge, u_MaxColorOverLifeGradientRanges);
            vec4 mixedColor = mix(color1, color2, a_Random0.y);
            color *= mixedColor;
        }
        return color;
    }

    float getMixGradientValue(in vec2 gradient[4], in vec2 gradientMax[4], in float normalizedAge, in float randomValue) 
    {
        float gradientValue = getCurValueFromGradientFloat(gradient, normalizedAge);
        float gradientMaxValue = getCurValueFromGradientFloat(gradientMax, normalizedAge);
        return mix(gradientValue, gradientMaxValue, randomValue);
    } 

    vec3 computeParticleLifeVelocity(in float normalizedAge)
    {
        vec3 outLifeVelocity;
        outLifeVelocity = vec3(
            getMixGradientValue(u_VOLVelocityGradientX,u_VOLVelocityGradientMaxX,normalizedAge,a_Random1.y),
            getMixGradientValue(u_VOLVelocityGradientY,u_VOLVelocityGradientMaxY,normalizedAge,a_Random1.z),
            getMixGradientValue(u_VOLVelocityGradientZ,u_VOLVelocityGradientMaxZ,normalizedAge,a_Random1.w)
        );

        return outLifeVelocity;
    }

    //合并Billboard和Mesh的Size计算
    vec3 computeParticleSize(in vec3 size, in float normalizedAge)
    {
        vec3 tempVal = vec3(
            getMixGradientValue(u_SOLSizeGradientX,u_SOLSizeGradientMaxX,normalizedAge,a_Random0.z),
            getMixGradientValue(u_SOLSizeGradientY,u_SOLSizeGradientMaxY,normalizedAge,a_Random0.z),
            getMixGradientValue(u_SOLSizeGradientZ,u_SOLSizeGradientMaxZ,normalizedAge,a_Random0.z)
        );
        tempVal = mix(vec3(1.0), tempVal, float(u_sizeoverlifetime_step == 1));
        return size * tempVal;
    }

    float mixGradientValue(in vec2 gradient[4], in vec2 gradientMax[4], in float normalizedAge, in float randomValue) 
    {
        float gradientValue = getTotalValueFromGradientFloat(gradient, normalizedAge);
        float gradientMaxValue = getTotalValueFromGradientFloat(gradientMax, normalizedAge);
        return mix(gradientValue, gradientMaxValue, randomValue);
    }

    vec3 computeParticleRotation(in vec3 rotation, in float normalizedAge)
    {
        vec3 tempVal = vec3(
            mixGradientValue(u_ROLAngularVelocityGradientX, u_ROLAngularVelocityGradientMaxX, normalizedAge, a_Random0.w),
            mixGradientValue(u_ROLAngularVelocityGradientY, u_ROLAngularVelocityGradientMaxY, normalizedAge, a_Random0.w),
            mixGradientValue(u_ROLAngularVelocityGradientZ, u_ROLAngularVelocityGradientMaxZ, normalizedAge, a_Random0.w)
        );
        rotation += (u_rotation_step > 0) ? tempVal : vec3(0.0);
        return rotation;
    }
    

    vec3 computeParticlePosition(in vec3 startVelocity, in vec3 lifeVelocity, in float age, in float normalizedAge, vec3 gravityVelocity, vec4 worldRotation, vec3 dragData)
    {
        vec3 startPosition = getStartPosition(startVelocity, age, dragData);
        // 预计算标志位
        bool isScalingModeNot2 = (u_ScalingMode != 2);
        bool isSimulationSpace = (u_SimulationSpace != 0);
        bool isVOLSpaceType0 = (u_VOLSpaceType == 0);
        bool isVelocityStepNot1 = (u_velocity_step != 1);

        // 预计算标志位对应的浮点数
        float scalingModeFlag = float(isScalingModeNot2);
        float simulationSpaceFlag = float(isSimulationSpace);
        float volSpaceTypeFlag = float(isVOLSpaceType0);
        float velocityStepFlag = float(isVelocityStepNot1);

        float oneMinusVOLSpace = 1.0 - volSpaceTypeFlag;
        float oneMinusScalingMode = 1.0 - scalingModeFlag;
        
        vec3 lifePosition = vec3(0.0);
        if (!isVelocityStepNot1) {
            lifePosition = vec3(
                mixGradientValue(u_VOLVelocityGradientX, u_VOLVelocityGradientMaxX, normalizedAge, a_Random1.y),
                mixGradientValue(u_VOLVelocityGradientY, u_VOLVelocityGradientMaxY, normalizedAge, a_Random1.z),
                mixGradientValue(u_VOLVelocityGradientZ, u_VOLVelocityGradientMaxZ, normalizedAge, a_Random1.w)
            );
        }
        vec3 finalPosition;

        vec3 position = a_ShapePositionStartLifeTime.xyz + startPosition * scalingModeFlag + lifePosition * volSpaceTypeFlag * scalingModeFlag;
        vec3 scaledPosition = u_PositionScale * (position * scalingModeFlag + a_ShapePositionStartLifeTime.xyz * oneMinusScalingMode);

        finalPosition = rotationByQuaternions(scaledPosition, worldRotation) + lifePosition * oneMinusVOLSpace;

        scaledPosition = u_PositionScale * (a_ShapePositionStartLifeTime.xyz + startPosition * scalingModeFlag) + startPosition * oneMinusScalingMode;
        finalPosition = mix(finalPosition, rotationByQuaternions(scaledPosition, worldRotation), velocityStepFlag);

        finalPosition += mix(a_SimulationWorldPostion, u_WorldPosition, simulationSpaceFlag);
        finalPosition += 0.5 * gravityVelocity * age;

        return finalPosition;
    }


    vec2 computeParticleUV(in vec2 uv, in float normalizedAge)
    {
    	if (u_texturesheetanimation_step == 1) {
            float cycleNormalizedAge = normalizedAge * u_TSACycles;
            float uvNormalizedAge = fract(cycleNormalizedAge); // 使用 fract 代替 cycleNormalizedAge - floor(cycleNormalizedAge)
            
            float res1 = getFrameFromGradient(u_TSAGradientUVs, uvNormalizedAge);
            float res2 = getFrameFromGradient(u_TSAMaxGradientUVs, uvNormalizedAge);
            // 预计算 frame
            float frame = floor(mix(res1,res2,a_Random1.x));
            
            float totalULength = frame * u_TSASubUVLength.x;
            float floorTotalULength = floor(totalULength);
            
            // 更新 uv
            uv.x += totalULength - floorTotalULength;
            uv.y += floorTotalULength * u_TSASubUVLength.y;
        }
        return uv;
    }

    void main()
    {
        v_MeshColor = vec4(1.0);
        float age = u_CurrentTime - a_DirectionTime.w;
        float normalizedAge = age / a_ShapePositionStartLifeTime.w;

        if (normalizedAge < 1.0)
        {
            bool isVelEqu1 = u_velocity_step == 1;
            bool isSimEqu0 = u_SimulationSpace == 0;
            bool isRotGreat0 = u_rotation_step > 0;

            float flag_Vel = float(isVelEqu1);
            float flag1 = float(isSimEqu0);
            float flag_Rot = float(isRotGreat0);
            float flag_threeDRot = float(u_ThreeDStartRotation);
            vec3 lifeVelocity = mix(vec3(0.0), computeParticleLifeVelocity(normalizedAge), flag_Vel);
            vec3 startVelocity = a_DirectionTime.xyz * a_StartSpeed;
            vec3 gravityVelocity = u_Gravity * age;

            vec4 worldRotation = mix(u_WorldRotation, a_SimulationWorldRotation, flag1);
            vec3 dragData = a_DirectionTime.xyz * mix(u_DragConstanct.x, u_DragConstanct.y, a_Random0.x);
            vec3 center = computeParticlePosition(startVelocity, lifeVelocity, age, normalizedAge, gravityVelocity, worldRotation, dragData); // 计算粒子位置
            vec2 corner = a_CornerTextureCoordinate.xy;
            vec2 size = computeParticleSize(a_StartSize, normalizedAge).xy;
            vec3 vector_x = vec3(0.0, 0.0, a_StartRotation0.x);
            vec3 vector_minusX = vec3(0.0, 0.0, -a_StartRotation0.x);
            vec3 vector_z = vec3(0.0, 0.0, a_StartRotation0.z);

            float oneMinusThreeDRot = 1.0 - flag_threeDRot;

            float rot = computeParticleRotation(vector_x, normalizedAge).z;
            float c = cos(rot);
            float s = sin(rot);
            mat2 rotation = mat2(c, -s, s, c);

            vec3 cameraUpVector, sideVector;

            if (u_billboard_step == 2) {
                int st1 = u_velocity_step * u_VOLSpaceType;
                int st2 = u_velocity_step * (1 - u_VOLSpaceType);
                vec3 velocity = gravityVelocity + lifeVelocity * vec3(st1) + rotationByQuaternions(u_SizeScale * (startVelocity + lifeVelocity * vec3(st2)),worldRotation);
                cameraUpVector = normalize(velocity);
                vec3 direction = normalize(center - u_CameraPos);
                sideVector = normalize(cross(direction, cameraUpVector));
                sideVector = u_SizeScale.xzy * sideVector;
                cameraUpVector *= length(vec3(u_SizeScale.x, 0.0, 0.0));
                const mat2 rotaionZHalfPI = mat2(0.0, -1.0, 1.0, 0.0);
                corner = rotaionZHalfPI * corner;
                corner.y -= abs(corner.y);
                float speed = length(velocity);
                // 提前计算 sign 的结果
                float signSizeScaleX = sign(u_SizeScale.x);
                float signStretchedBillboardLengthScale = sign(u_StretchedBillboardLengthScale);
                vec3 cornerXComponent = size.x * corner.x * sideVector;
                vec3 cornerYComponent = (speed * u_StretchedBillboardSpeedScale + size.y * u_StretchedBillboardLengthScale) * corner.y * cameraUpVector;
                center += signSizeScaleX * (signStretchedBillboardLengthScale * cornerXComponent + cornerYComponent);
            } else if (u_billboard_step == 1) {
                cameraUpVector = normalize(u_CameraUp);
                sideVector = normalize(cross(u_CameraDirection, cameraUpVector));
                vec3 upVector = normalize(cross(sideVector, u_CameraDirection));
                corner *= size;
                //vec3 rotation3D = mix(a_StartRotation0, vec3(a_StartRotation0.xy, computeParticleRotation(vec3(0.0, 0.0, a_StartRotation0.z), normalizedAge).z), flag_Rot);
                float rot2D = mix(a_StartRotation0.x, rot, flag_Rot);
                c = cos(rot2D);
                s = sin(rot2D);
                rotation = mat2(c, -s, s, c);
                corner = rotation * corner;
                center += u_SizeScale.xzy * (corner.x * sideVector + corner.y * upVector);
                //center += u_SizeScale.xzy * (flag_threeDRot * rotationByEuler(corner.x * sideVector + corner.y * upVector, rotation3D) + (1.0 - flag_threeDRot) * ((rotation2D * corner).x * sideVector + (rotation2D * corner).y * upVector));
            } else if (u_billboard_step == 3) {
                cameraUpVector = vec3(0.0, 0.0, 1.0);
                sideVector = vec3(-1.0, 0.0, 0.0);
                // float rot2D = computeParticleRotation(vec3(0.0, 0.0, a_StartRotation0.x), normalizedAge).z;
                // float c = cos(rot);
                // float s = sin(rot);
                // mat2 rotation = mat2(c, -s, s, c);
                // 预计算常量
                const float cosValue = 0.70710678118654752440084436210485; // cos(45 degrees)
                corner = rotation * corner * cosValue;
                corner *= size;
                center += u_SizeScale.xzy * (corner.x * sideVector + corner.y * cameraUpVector);
            } else if (u_billboard_step == 5) {
                vec3 tsize = computeParticleSize(a_StartSize, normalizedAge);
                vec3 meshPositionScaled = u_SizeScale * a_MeshPosition * tsize;
                vec3 rotation = vec3(0.0);
                vec3 axis = mix(vec3(0.0, 0.0, -1.0), vec3(0.0, -1.0, 0.0), u_shape);
                float angle = computeParticleRotation(vector_x, normalizedAge).z;
                vec3 angleVec3 = computeParticleRotation(vector_minusX, normalizedAge);
                bool hasShapePosition = (a_ShapePositionStartLifeTime.x != 0.0 || a_ShapePositionStartLifeTime.y != 0.0);
                vec3 shapePosition = vec3(a_ShapePositionStartLifeTime.xy, 0.0);
                vec3 crossAxis = normalize(cross(vec3(0.0, 0.0, 1.0), shapePosition));
                vec3 rotationAxis = hasShapePosition ? crossAxis : axis;
                
                // 根据 flag_Rot 和 flag_threeDRot 计算 rotation
                vec3 tmpVec2 = oneMinusThreeDRot * rotation;
                vec3 tmpVec = flag_threeDRot * vec3(a_StartRotation0.xy, computeParticleRotation(vector_z, normalizedAge).z) + tmpVec2;
                vec3 tmpVec1 = flag_threeDRot * a_StartRotation0 + tmpVec2;

                rotation = (isRotGreat0) ? tmpVec : tmpVec1;
                            
                vec3 quat1 = rotationByEuler(meshPositionScaled, rotation);
                vec3 quat2 = rotationByQuaternions(quat1,worldRotation);
                vec3 quat3 = rotationByAxis(meshPositionScaled, rotationAxis, angle);
                vec3 quat4 = rotationByQuaternions(quat3,worldRotation);
                // 根据 flag_threeDRot 计算 rotationResult
                vec3 rotationResult = (u_ThreeDStartRotation) ?
                                    quat2 :
                                    mix(
                                        quat3,
                                        quat4,
                                        float(u_SimulationSpace == 1)
                                    );

                // 提前计算常量结果
                bool isRotationStep2 = (u_rotation_step == 2);
                vec3 eulerRotation = rotationByEuler(meshPositionScaled, angleVec3);
                vec3 quaternionRotation = rotationByQuaternions(eulerRotation, worldRotation);
                vec3 mixedRotation = mix(rotationResult, quaternionRotation, float(isRotationStep2));

                // 使用if-else语句替代三元运算符
                if (!u_ThreeDStartRotation) {
                    rotationResult = mixedRotation;
                }

                center += rotationResult;
                v_MeshColor = a_MeshColor;
            }
            
            if(CurveWorld)
            {
                LittlePlanet_Y_Curve(center);
            }
            worldPosXYZ = center;
            gl_Position = u_Projection * u_View * vec4(center, 1.0);
            vec4 startcolor = gammaToLinear(a_StartColor);
            v_Color = computeParticleColor(startcolor, normalizedAge);
    //#ifdef DIFFUSEMAP
            vec2 simulateUV = a_SimulationUV.xy;
            // 合并条件判断，使用条件运算符简化逻辑
            simulateUV += (u_billboard_step == 5) ? 
                        a_MeshTextureCoordinate * a_SimulationUV.zw :
                        a_CornerTextureCoordinate.zw * a_SimulationUV.zw;
                        

            v_TextureCoordinate.xy = computeParticleUV(simulateUV, normalizedAge);

        //Custom
            vec2 sourceUV = v_TextureCoordinate.xy;
            vec2 mainUV = TransformUV(sourceUV, u_TilingOffset);
            mainUV = rotateUV(mainUV,_AlbedoTextureUVAnim.z);
            mainUV += fract(_AlbedoTextureUVAnim.xy * u_Time);
            
            vec2 maskUV = TransformUV(sourceUV, _MaskTilingOffset);
            maskUV += fract(_MaskUVAnim.xy * u_Time);
            
            v_TextureCoordinate.xy = mainUV;
            v_TextureCoordinate.zw = maskUV;

        #ifdef EnableDistort
            v_distortUV = getDistortTexUV(sourceUV,u_Time);
        #endif
        
        #ifdef EnableDissolve
            v_dissolveUV.xy = getDissolveTexUV(sourceUV,u_Time);
        #endif
            
//#ifdef ZHFOG
        //GetFogParam(v_fogParam,center.y,gl_Position,u_ProjectionParams);
//#endif

        v_Color *= u_Tintcolor * u_TintcolorStrength;

    //#endif
        }
        else
        {
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // Discard use out of X(-1,1),Y(-1,1),Z(0,1)
        }

        // Vertex vertex;
        // getVertexParams(vertex);
        // PixelParams pixel;
        // initPixelParams(pixel, vertex);
        // gl_Position = getPositionCS(pixel.positionWS);
        gl_Position = remapPositionZ(gl_Position);
        // #ifdef FOG
        //     FogHandle(gl_Position.z);
        // #endif // FOG 
    }

#endGLSL 

#defineGLSL ParticleFS
    #define SHADER_NAME ParticleFS

    #include "Scene.glsl";
    //#include "SceneFog.glsl";
    #include "Color.glsl";

    #include "./ShaderLibrary/EffectCommonInput.glsl";
    #include "./ShaderLibrary/ShaderFunctionSupport.glsl";

    const vec4 c_ColorSpace = vec4(4.59479380, 4.59479380, 4.59479380, 2.0);

    varying vec4 v_Color;
    varying vec4 v_TextureCoordinate;
    // uniform sampler2D u_texture;
    // uniform vec4 u_Tintcolor;


    varying vec4 v_MeshColor;
    varying vec3 worldPosXYZ;

#ifdef EnableDissolve
    varying vec2 v_dissolveUV;
#endif

#ifdef EnableDistort
    varying vec2 v_distortUV;
#endif

    //#ifdef ZHFOG
    //varying vec2 v_fogParam;
    //#endif

    void main()
    {
        vec4 color = v_MeshColor;

//#ifdef DIFFUSEMAP
        vec2 mainUV = v_TextureCoordinate.xy;

        float distort = 0.0;
    #ifdef EnableDistort
        vec4 distortCol = texture2D(_DistortMap,v_distortUV);
        distort = distortCol.r * _DistortFactor;
    #endif

        if(_AlbedoReceiveDistort)
        {
            mainUV += vec2(distort);
        }

        vec4 colorT = texture2D(u_texture, mainUV);
        #ifdef Gamma_u_texture
            colorT = gammaToLinear(colorT);
        #endif // Gamma_u_SpecularTexture
        // #ifdef TINTCOLOR
        // color *= colorT * u_Tintcolor * c_ColorSpace * v_Color;
        // #else
        color *= colorT * v_Color;
        //#endif // TINTCOLORd

    #ifdef EnableDissolve
        vec2 dissolveUV = v_dissolveUV;
        if(_DissolveReceiveDistort)
        {
            dissolveUV += vec2(distort);
        }
        vec4 ClipTexCol = texture2D(_DissolveMap,dissolveUV.xy);
        mediump float clipSource = min(ClipTexCol.r, ClipTexCol.a);
        mediump vec2 dissolveData = vec2(_DissolveFactor,_DissolveEdge);
        dissolveData = dissolveData * 2.0 - 1.0;
        mediump vec2 soft = vec2(_DissolveSoft,_DissolveEdgeSoft);
        mediump float clipArea = clipSource - dissolveData.x;
        mediump float clipEdge = saturate(clipArea - dissolveData.y);
        
        mediump vec2 ClipAreaAndEdge = smoothstep(0.5 - soft, 0.5 + soft, vec2(clipArea, clipEdge));
        ClipAreaAndEdge.y = 1.0 - ClipAreaAndEdge.y;
        //color.rgb += _DissolveEdgeColor.rgb * ClipAreaAndEdge.y;
        color.rgb = mix(color.rgb,_DissolveEdgeColor.rgb,ClipAreaAndEdge.y);
        color.a *= ClipAreaAndEdge.x;
    #endif


    #ifdef EnableMask
        vec2 maskUV = v_TextureCoordinate.zw;
        if(_MaskReceiveDistort)
        {
            maskUV += vec2(distort);
        }
        vec4 maskCol = texture2D(_MaskMap,maskUV);
        float mask = maskCol.r;
        if(_MaskChannelA)
        {
            mask = maskCol.a;
        }
        color.a *= mask;
    #endif
// #else
//         #ifdef TINTCOLOR
//         color *= u_Tintcolor * c_ColorSpace * v_Color;
//         #else
//         color *= v_Color;
//         #endif // TINTCOLOR
// #endif

    #ifdef ALPHATEST
    if(color.a < u_AlphaTestValue)
    {
        discard;
    }
    #endif
        
//#ifdef ZHFOG
//        #ifdef ADDITIVEFOG
//        ApplyFog(color.rgb,v_fogParam,color.a);
//        #else
//        ApplyFog(color.rgb,v_fogParam);
//        #endif
//#endif
        
        //ApplyFog(color.rgb,v_fogParam,color.a,_ReceiveFog,_AdditiveFog);

        if(isUIEffect)
        {
            color = linearToGamma(color);
        }
        if(_EnableSoftParticle)
        {
            ApplySoftParticleTemp(worldPosXYZ, color.a,_SoftParticleStartHeight,_SoftParticleEndHeight,_Softness);
        }

        gl_FragColor = color;

        gl_FragColor = outputTransform(gl_FragColor);
    }
#endGLSL
GLSL End


