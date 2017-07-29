import axios from 'axios'
import debounce from 'debounce'
import {
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_YEARS_UPDATE,
  START_DOWNLOAD_LOAD,
  START_EXPORT_LOAD,
  FINISHED_EXPORT_LOAD,
  FINISHED_DOWNLOAD_LOAD,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SCENE_CONTAINER } from './types'
import exportSceneX3D from './x3d-exporter'
import download from 'downloadjs'

const BASE_URL = 'http://localhost:5000'

export const loadContributions = (entity, year) => (dispatch) => {
  dispatch({ type: START_CONTRIBUTION_UPDATE })
  return axios.get(`${BASE_URL}/v1/contributions`, { params: {entity, year} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: Handle error
      } else {
        dispatch({
          type: RECEIVED_CONTRIBUTION_DATA,
          data: response.data.contributions,
          entity: entity,
          year: year
        })
      }
    })
}

const debouncedYearOptionsFetch = debounce((dispatch, entity) => {
  dispatch({type: START_YEARS_UPDATE})
  return axios.get(`${BASE_URL}/v1/years`, { params: {entity} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: handle error
      } else {
        const years = response.data.years
        dispatch({ type: RECEIVED_YEAR_OPTIONS, years: years })

        if (years) {
          const previousYear = (new Date().getFullYear() - 1).toString()
          const defaultYear = years.includes(previousYear) ? previousYear : years[0]
          dispatch({ type: UPDATE_SELECTED_YEAR, year: defaultYear })
          loadContributions(entity, defaultYear)(dispatch)
        }
      }
    })
}, 200)

export const updateSelectedEntity = (entity) => (dispatch, getState) => {
  if (entity === getState().entity) {
    return
  }

  dispatch({ type: UPDATE_SELECTED_ENTITY, entity })
  return debouncedYearOptionsFetch(dispatch, entity)
}

export const updateSelectedYear = (year) => (dispatch, getState) => {
  if (year === getState().year) {
    return
  }

  dispatch({ type: UPDATE_SELECTED_YEAR, year })
  dispatch({ type: START_CONTRIBUTION_UPDATE })

  const entity = getState().entity

  return axios.get(`${BASE_URL}/v1/contributions`, { params: {entity, year} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: Handle error
      } else {
        dispatch({
          type: RECEIVED_CONTRIBUTION_DATA,
          data: response.data.contributions,
          entity: entity,
          year: year
        })
      }
    })
}

export const setSceneContainer = (container) => {
  return {type: UPDATE_SCENE_CONTAINER, container}
}

export const downloadModel = () => (dispatch, getState) => {
  dispatch({type: START_DOWNLOAD_LOAD})
  const { container, entity, year } = getState()
  const scene = container.refs.preview.refs.scene
  const fileName = `${entity.replace('/', '-')}-${year}.x3d`

  // Yield control to the renderer
  return setTimeout(() => {
    const x3dData = exportSceneX3D(scene)
    download(x3dData, fileName, 'model/x3d+xml')
    dispatch({type: FINISHED_DOWNLOAD_LOAD})
  }, 5)
}

export const exportModel = () => (dispatch, getState) => {
  dispatch({type: START_EXPORT_LOAD})
  const { container, entity, year } = getState()
  const scene = container.refs.preview.refs.scene

  // Yield control to the renderer
  return setTimeout(() => {
    const x3dData = exportSceneX3D(scene)
    dispatch({type: FINISHED_EXPORT_LOAD})
  }, 5)
}
