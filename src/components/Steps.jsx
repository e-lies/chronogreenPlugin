import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  Fab,
  ButtonGroup,
  Icon,
} from '@material-ui/core';

export default function Steps(props) {
  const {
    jsn, orientation, originalStep, color, stepsDetail,
  } = props;
  const [active, setActive] = useState(originalStep);
  const onMove = (type, step) => {
    setActive(type === 'previous' ? active - 1 : active + 1);
    if (type === 'previous' && stepsDetail[step].onPrevious) {
      stepsDetail[step].onPrevious();
    }
    if (type === 'next' && stepsDetail[step].onNext) {
      stepsDetail[step].onNext();
    }
  };
  return (
    <Stepper {...props} activeStep={active}>
      {stepsDetail.map((stp, i) => { console.log("stp = ",stp)
         let Icn = ()=>{ return(stp.icon ? <Icon>{stp.icon}</Icon> : <></>) }
          return(<Step key={`step${i}`} StepIconComponent={Icn}>
              <StepButton onClick={() => setActive(i)}>
                <StepLabel>
                  <Typography variant="h5">
                    {stp.label(jsn)}
                  </Typography>
                </StepLabel>
              </StepButton>
              <StepContent>
                {stp.content(jsn)}
                <ButtonGroup
                  style={{ width: 100, display: 'flex', justifyContent: 'space-between', margin: 20 }}
                >
                  {i > 0 && (
                  <Fab key="fab1" color={color} onClick={() => onMove('previous', i)}>
                    <Icon>arrow_upward</Icon>
                  </Fab>
                  )}
                  {i < stepsDetail.length - 1 && (
                  <Fab key="fab2" color={color} onClick={() => onMove('next', i)}>
                    <Icon>arrow_downward</Icon>
                  </Fab>
                  )}
                </ButtonGroup>
              </StepContent>
            </Step>
      )})
    }
    </Stepper>
  );
}
Steps.propTypes = {
  /**
   * Objet contenant les données utiles pour le stepper
   */
  jsn: PropTypes.shape.isRequired,
  /**
   * Orientation du stepper (vertical par défaut ou horizontal)
   */
  orientation: PropTypes.string,
  /**
   * Step au moment du Mount (0 par défaut)
   */
  originalStep: PropTypes.number,
  /**
   * Couleur du thème du stepper
   */
  color: PropTypes.string,
  /**
   * Un array qui contiendra l'icone, le label (sous forme de fonction), et le contenu du step, ainsi que les events à déclencher onNext, onPrevious
   */
  stepsDetail: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.func,
      content: PropTypes.func.isRequired,
      onNext: PropTypes.func,
      onPrevious: PropTypes.func,
    }),
  ),
};
Steps.defaultProps = {
  orientation: 'vertical',
  originalStep: 0,
  color: 'primary',
  stepsDetail: [{ content: <div>Rien à afficher</div> }],
};
