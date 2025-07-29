SELECT * FROM sim.Simulation

select InitialSceneJson from sim.Simulation where Id = 1

-- 2 Basic Shapes
/*

INSERT INTO sim.Simulation
(
CreationTime,
CreatorUserId,
IsDeleted,
Name,
InitialSceneJson
)
VALUES
(
'2022-06-16 13:00:00.0000000',
NULL,
0,
'Basic Demo',
'{
    "metadata": {
        "version": 4.5,
        "type": "Object",
        "generator": "Object3D.toJSON"
    },
    "geometries": [{
        "uuid": "257A2CE0-83E1-43A6-BB51-1BD8BDD2D220",
        "type": "BoxGeometry",
        "width": 1,
        "height": 2,
        "depth": 1,
        "widthSegments": 1,
        "heightSegments": 1,
        "depthSegments": 1
    }, {
        "uuid": "D30E37D0-C494-42EB-83FE-613AA5356403",
        "type": "BoxGeometry",
        "width": 1,
        "height": 2,
        "depth": 1,
        "widthSegments": 1,
        "heightSegments": 1,
        "depthSegments": 1
    }, {
        "uuid": "15C6B9D5-0A54-4270-A6D4-C3D6B7B5D87D",
        "type": "SphereGeometry",
        "radius": 2,
        "widthSegments": 10,
        "heightSegments": 10,
        "phiStart": 0,
        "phiLength": 6.283185307179586,
        "thetaStart": 0,
        "thetaLength": 3.141592653589793
    }, {
        "uuid": "DB8CE276-18B4-458C-BBB0-26E4F82CEB14",
        "type": "CylinderGeometry",
        "radiusTop": 1,
        "radiusBottom": 1,
        "height": 2,
        "radialSegments": 25,
        "heightSegments": 1,
        "openEnded": false,
        "thetaStart": 0,
        "thetaLength": 6.283185307179586
    }, {
        "uuid": "444D2AC4-8A47-4E4B-8557-152D468152C5",
        "type": "CylinderGeometry",
        "radiusTop": 1,
        "radiusBottom": 1,
        "height": 2,
        "radialSegments": 25,
        "heightSegments": 1,
        "openEnded": false,
        "thetaStart": 0,
        "thetaLength": 6.283185307179586
    }],
    "materials": [{
        "uuid": "67EA82CC-BF28-4FB3-90F2-7217837CFBE6",
        "type": "MeshBasicMaterial",
        "color": 10481111,
        "reflectivity": 1,
        "refractionRatio": 0.98,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680
    }, {
        "uuid": "DAD69B54-0FE1-4EDF-8717-6D4FF3A293EA",
        "type": "MeshBasicMaterial",
        "color": 10481111,
        "reflectivity": 1,
        "refractionRatio": 0.98,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680
    }, {
        "uuid": "C9E015CE-FB68-43CD-A1AB-F492D863B9B3",
        "type": "MeshBasicMaterial",
        "color": 16572801,
        "reflectivity": 1,
        "refractionRatio": 0.98,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680
    }, {
        "uuid": "451053A4-E1AA-48DD-975D-2BD547F17CAC",
        "type": "MeshBasicMaterial",
        "color": 10481111,
        "reflectivity": 1,
        "refractionRatio": 0.98,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680
    }, {
        "uuid": "A04E85B8-7ADE-4740-BEF8-8BC7C753E663",
        "type": "MeshBasicMaterial",
        "color": 10481111,
        "reflectivity": 1,
        "refractionRatio": 0.98,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680
    }],
    "object": {
        "uuid": "CADCEA16-744D-4024-8B1A-D874AD95EC87",
        "type": "Scene",
        "layers": 1,
        "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        "children": [{
            "uuid": "688822C5-5572-4309-9D18-47E366E37E59",
            "type": "Mesh",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, -2, 1],
            "geometry": "257A2CE0-83E1-43A6-BB51-1BD8BDD2D220",
            "material": "67EA82CC-BF28-4FB3-90F2-7217837CFBE6"
        }, {
            "uuid": "66848A96-2E19-48EB-85F6-5C7E6A50FFA0",
            "type": "Mesh",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, -3, 1],
            "geometry": "D30E37D0-C494-42EB-83FE-613AA5356403",
            "material": "DAD69B54-0FE1-4EDF-8717-6D4FF3A293EA"
        }, {
            "uuid": "270509B5-F836-407A-814A-32EEC490C4F6",
            "type": "Mesh",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -3, 5, -3, 1],
            "geometry": "15C6B9D5-0A54-4270-A6D4-C3D6B7B5D87D",
            "material": "C9E015CE-FB68-43CD-A1AB-F492D863B9B3"
        }, {
            "uuid": "28B32AED-F6E9-4BBA-B7AE-6B2CB731FA4A",
            "type": "Mesh",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -7, 0, -5, 1],
            "geometry": "DB8CE276-18B4-458C-BBB0-26E4F82CEB14",
            "material": "451053A4-E1AA-48DD-975D-2BD547F17CAC"
        }, {
            "uuid": "1DB7692B-3DE8-4856-AA35-BFE80E0BE039",
            "type": "Mesh",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -3, 0, -6, 1],
            "geometry": "444D2AC4-8A47-4E4B-8557-152D468152C5",
            "material": "A04E85B8-7ADE-4740-BEF8-8BC7C753E663"
        }, {
            "uuid": "016B8751-8007-43A8-A4DC-358B64417491",
            "type": "PerspectiveCamera",
            "layers": 1,
            "matrix": [1, 0, 0, 0, 0, 1, -6.123233995736765e-17, 0, 0, 6.123233995736765e-17, 1, 0, 0, 1.8369701987210297e-16, 3, 1],
            "fov": 75,
            "zoom": 1,
            "near": 0.1,
            "far": 100,
            "focus": 10,
            "aspect": 1.4709141274238227,
            "filmGauge": 35,
            "filmOffset": 0
        }]
    }
}'
)

*/