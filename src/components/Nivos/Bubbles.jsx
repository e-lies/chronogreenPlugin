import React from 'react'
import PropTypes from 'prop-types'
import { ResponsiveBubble } from '@nivo/circle-packing'

let data = {
  "name": "nivo",
  "color": "hsl(300, 70%, 50%)",
  "children": [
    {
      "name": "viz",
      "color": "#D88",
      "children": [
        {
          "name": "stack",
          "color": "hsl(238, 70%, 50%)",
          "children": [
            {
              "name": "chart",
              "color": "hsl(230, 70%, 50%)",
              "loc": 164063
            },
            {
              "name": "xAxis",
              "color": "hsl(108, 70%, 50%)",
              "loc": 96724
            },
            {
              "name": "yAxis",
              "color": "hsl(26, 70%, 50%)",
              "loc": 71746
            },
            {
              "name": "layers",
              "color": "hsl(136, 70%, 50%)",
              "loc": 194075
            }
          ]
        },
        {
          "name": "pie",
          "color": "hsl(71, 70%, 50%)",
          "children": [
            {
              "name": "chart",
              "color": "hsl(129, 70%, 50%)",
              "children": [
                {
                  "name": "pie",
                  "color": "hsl(109, 70%, 50%)",
                  "children": [
                    {
                      "name": "outline",
                      "color": "hsl(55, 70%, 50%)",
                      "loc": 14632
                    },
                    {
                      "name": "slices",
                      "color": "hsl(21, 70%, 50%)",
                      "loc": 88770
                    },
                    {
                      "name": "bbox",
                      "color": "hsl(37, 70%, 50%)",
                      "loc": 5114
                    }
                  ]
                },
                {
                  "name": "donut",
                  "color": "hsl(247, 70%, 50%)",
                  "loc": 196358
                },
                {
                  "name": "gauge",
                  "color": "hsl(102, 70%, 50%)",
                  "loc": 196204
                }
              ]
            },
            {
              "name": "legends",
              "color": "hsl(184, 70%, 50%)",
              "loc": 165739
            }
          ]
        }
      ]
    },
    {
      "name": "colors",
      "color": "hsl(88, 70%, 50%)",
      "children": [
        {
          "name": "rgb",
          "color": "hsl(124, 70%, 50%)",
          "loc": 152447
        },
        {
          "name": "hsl",
          "color": "hsl(241, 70%, 50%)",
          "loc": 74640
        }
      ]
    },
    {
      "name": "utils",
      "color": "hsl(61, 70%, 50%)",
      "children": [
        {
          "name": "randomize",
          "color": "hsl(111, 70%, 50%)",
          "loc": 144993
        },
        {
          "name": "resetClock",
          "color": "hsl(334, 70%, 50%)",
          "loc": 155692
        },
        {
          "name": "noop",
          "color": "hsl(15, 70%, 50%)",
          "loc": 119515
        },
        {
          "name": "tick",
          "color": "hsl(43, 70%, 50%)",
          "loc": 78902
        },
        {
          "name": "forceGC",
          "color": "hsl(235, 70%, 50%)",
          "loc": 111654
        },
        {
          "name": "stackTrace",
          "color": "hsl(19, 70%, 50%)",
          "loc": 44746
        },
        {
          "name": "dbg",
          "color": "hsl(123, 70%, 50%)",
          "loc": 130222
        }
      ]
    },
    {
      "name": "generators",
      "color": "hsl(343, 70%, 50%)",
      "children": [
        {
          "name": "address",
          "color": "hsl(30, 70%, 50%)",
          "loc": 41179
        },
        {
          "name": "city",
          "color": "hsl(170, 70%, 50%)",
          "loc": 148201
        },
        {
          "name": "animal",
          "color": "hsl(62, 70%, 50%)",
          "loc": 123251
        },
        {
          "name": "movie",
          "color": "hsl(276, 70%, 50%)",
          "loc": 130740
        },
        {
          "name": "user",
          "color": "hsl(145, 70%, 50%)",
          "loc": 16522
        }
      ]
    },
    {
      "name": "set",
      "color": "hsl(50, 70%, 50%)",
      "children": [
        {
          "name": "clone",
          "color": "hsl(243, 70%, 50%)",
          "loc": 166401
        },
        {
          "name": "intersect",
          "color": "hsl(93, 70%, 50%)",
          "loc": 103565
        },
        {
          "name": "merge",
          "color": "hsl(123, 70%, 50%)",
          "loc": 134466
        },
        {
          "name": "reverse",
          "color": "hsl(100, 70%, 50%)",
          "loc": 40202
        },
        {
          "name": "toArray",
          "color": "hsl(288, 70%, 50%)",
          "loc": 87142
        },
        {
          "name": "toObject",
          "color": "hsl(73, 70%, 50%)",
          "loc": 26014
        },
        {
          "name": "fromCSV",
          "color": "hsl(251, 70%, 50%)",
          "loc": 43587
        },
        {
          "name": "slice",
          "color": "hsl(177, 70%, 50%)",
          "loc": 146412
        },
        {
          "name": "append",
          "color": "hsl(104, 70%, 50%)",
          "loc": 173849
        },
        {
          "name": "prepend",
          "color": "hsl(241, 70%, 50%)",
          "loc": 42002
        },
        {
          "name": "shuffle",
          "color": "hsl(177, 70%, 50%)",
          "loc": 171311
        },
        {
          "name": "pick",
          "color": "hsl(110, 70%, 50%)",
          "loc": 96410
        },
        {
          "name": "plouc",
          "color": "hsl(96, 70%, 50%)",
          "loc": 189262
        }
      ]
    },
    {
      "name": "text",
      "color": "hsl(16, 70%, 50%)",
      "children": [
        {
          "name": "trim",
          "color": "hsl(160, 70%, 50%)",
          "loc": 60478
        },
        {
          "name": "slugify",
          "color": "hsl(187, 70%, 50%)",
          "loc": 116212
        },
        {
          "name": "snakeCase",
          "color": "hsl(290, 70%, 50%)",
          "loc": 119328
        },
        {
          "name": "camelCase",
          "color": "hsl(342, 70%, 50%)",
          "loc": 4880
        },
        {
          "name": "repeat",
          "color": "hsl(81, 70%, 50%)",
          "loc": 20367
        },
        {
          "name": "padLeft",
          "color": "hsl(210, 70%, 50%)",
          "loc": 170404
        },
        {
          "name": "padRight",
          "color": "hsl(65, 70%, 50%)",
          "loc": 155073
        },
        {
          "name": "sanitize",
          "color": "hsl(266, 70%, 50%)",
          "loc": 106423
        },
        {
          "name": "ploucify",
          "color": "hsl(169, 70%, 50%)",
          "loc": 174346
        }
      ]
    },
    {
      "name": "misc",
      "color": "hsl(312, 70%, 50%)",
      "children": [
        {
          "name": "whatever",
          "color": "hsl(30, 70%, 50%)",
          "children": [
            {
              "name": "hey",
              "color": "hsl(58, 70%, 50%)",
              "loc": 148157
            },
            {
              "name": "WTF",
              "color": "hsl(28, 70%, 50%)",
              "loc": 4940
            },
            {
              "name": "lol",
              "color": "hsl(154, 70%, 50%)",
              "loc": 40043
            },
            {
              "name": "IMHO",
              "color": "hsl(358, 70%, 50%)",
              "loc": 158204
            }
          ]
        },
        {
          "name": "other",
          "color": "hsl(194, 70%, 50%)",
          "loc": 36226
        },
        {
          "name": "crap",
          "color": "hsl(84, 70%, 50%)",
          "children": [
            {
              "name": "crapA",
              "color": "hsl(212, 70%, 50%)",
              "loc": 190601
            },
            {
              "name": "crapB",
              "color": "hsl(138, 70%, 50%)",
              "children": [
                {
                  "name": "crapB1",
                  "color": "hsl(22, 70%, 50%)",
                  "loc": 179691
                },
                {
                  "name": "crapB2",
                  "color": "hsl(25, 70%, 50%)",
                  "loc": 21789
                },
                {
                  "name": "crapB3",
                  "color": "hsl(75, 70%, 50%)",
                  "loc": 181099
                },
                {
                  "name": "crapB4",
                  "color": "hsl(311, 70%, 50%)",
                  "loc": 81967
                }
              ]
            },
            {
              "name": "crapC",
              "color": "hsl(273, 70%, 50%)",
              "children": [
                {
                  "name": "crapC1",
                  "color": "hsl(91, 70%, 50%)",
                  "loc": 158851
                },
                {
                  "name": "crapC2",
                  "color": "hsl(111, 70%, 50%)",
                  "loc": 137724
                },
                {
                  "name": "crapC3",
                  "color": "hsl(27, 70%, 50%)",
                  "loc": 150823
                },
                {
                  "name": "crapC4",
                  "color": "hsl(79, 70%, 50%)",
                  "loc": 59045
                },
                {
                  "name": "crapC5",
                  "color": "hsl(63, 70%, 50%)",
                  "loc": 68863
                },
                {
                  "name": "crapC6",
                  "color": "hsl(233, 70%, 50%)",
                  "loc": 22512
                },
                {
                  "name": "crapC7",
                  "color": "hsl(200, 70%, 50%)",
                  "loc": 141541
                },
                {
                  "name": "crapC8",
                  "color": "hsl(302, 70%, 50%)",
                  "loc": 92522
                },
                {
                  "name": "crapC9",
                  "color": "hsl(120, 70%, 50%)",
                  "loc": 72731
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

const Bubbles = props => {
	const { label, value, click } = props;
	return(
		<div id="chartBubble" style= {{height:'500px'}}>
			<ResponsiveBubble
	        root={data}
	        margin={{
	            "top": 20,
	            "right": 20,
	            "bottom": 20,
	            "left": 20
	        }}
	        onClick={click}
	        identity= {label}
	        value= {value}
	        colors="nivo"
	        colorBy={function(e){return e.color}}
	        padding={6}
	        labelTextColor="inherit:darker(0.8)"
	        borderWidth={2}
	        defs={[
	            {
	                "id": "lines",
	                "type": "patternLines",
	                "background": "none",
	                "color": "inherit",
	                "rotation": -45,
	                "lineWidth": 5,
	                "spacing": 8
	            }
	        ]}
	        fill={[
	            {
	                "match": {
	                    "depth": 1
	                },
	                "id": "lines"
	            }
	        ]}
	        animate={true}
	        motionStiffness={90}
	        motionDamping={12}
	    />
	</div>
	)
}
Bubbles.propTypes = {
  	data: PropTypes.object.isRequired,
  	click: PropTypes.func,
  	label: PropTypes.string.isRequired,
  	value: PropTypes.string.isRequired,
}
Bubbles.defaultProps = {
	label:"name",
	value:"loc",
	click : e => {console.log(e)},
}
export default Bubbles;