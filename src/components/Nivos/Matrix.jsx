/*import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { ResponsiveHeatMap } from '@nivo/heatmap'


const Matrix = props =>{
	const { data, index, Y, keys, onPointClick, width, height } = props;
	return(
	  <div id="chartMatrix" style= {{height, width}}>
		<ResponsiveHeatMap
        data={data}
        keys={keys}
        indexBy={index}
        onClick={onPointClick}
        margin={{
            "top": 73,
            "right": 87,
            "bottom": 40,
            "left": 114
        }}
        forceSquare={false}
        sizeVariation={0.6}
        padding={0}
        colors="nivo"
        axisTop={{
            "orient": "top",
            "tickSize": 6,
            "tickPadding": 8,
            "tickRotation": 45,
            "legend": "",
            "legendOffset": -18
        }}
        axisRight={null}
        axisBottom={{
            "orient": "bottom",
            "tickSize": 5,
            "tickPadding": 5,
            "tickRotation": -45,
            "legend": index,
            "legendPosition": "middle",
            "legendOffset": 36
        }}
        axisLeft={{
            "orient": "left",
            "tickSize": 5,
            "tickPadding": 5,
            "tickRotation": 0,
            "legend": Y,
            "legendPosition": "left",
            "legendOffset": 0
        }}
        enableGridX={true}
        enableGridY={true}
        cellShape="circle"
        cellOpacity={0.7}
        labelTextColor="inherit:darker(2.5)"
        defs={[
            {
                "id": "lines",
                "type": "patternLines",
                "background": "inherit",
                "color": "rgba(0, 0, 0, 0.1)",
                "rotation": -45,
                "lineWidth": 4,
                "spacing": 7
            }
        ]}
        fill={[
            {
                "id": "lines"
            }
        ]}
        animate={true}
        motionStiffness={240}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOpacity={0.95}
        cellHoverOthersOpacity={0.25}
    /></div>
	)
}
Matrix.propTypes = {
	keys: PropTypes.array.isRequired,
  click: PropTypes.func,
  index: PropTypes.string,
  onPointClick: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number,
}
Matrix.defaultProps = {
  width: '100%',
  height: 400,
  click : e => {return false},
  onPointClick: e=>console.log(e)
}
export default Matrix;*/