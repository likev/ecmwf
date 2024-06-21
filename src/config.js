const CONFIG = {
    'medium-uv-rh': {
        levels: [1000, 925, 850, 700, 500, 300, 250, 200],
        models: {
            'EC HRES': 'medium-uv-rh'
        }
    },

    'medium-uv-z': {
        levels: [1000, 925, 850, 700, 500, 300, 250, 200],
        models: {
            'Graphcast': 'graphcast_medium-uv-z',
            'EC HRES': 'medium-uv-z',
            'EC AIFS': 'aifs_medium-uv-z',
            'FuXi': 'fuxi_medium-uv-z'
        }
    },
    'medium-t-z':{
        levels: [1000, 925, 850, 700, 500, 300, 250, 200],
        models: {
            'Graphcast': 'graphcast_medium-t-z',
            'EC HRES': 'medium-t-z',
            'EC AIFS': 'aifs_medium-t-z',
            'FuXi': 'fuxi_medium-t-z'
        }
    },
    'medium-2t-wind':{
        type: 'single-level',
        levels: [1000],
        models: {
            'Graphcast': 'graphcast_medium-2t-wind',
            'EC HRES':'medium-2t-wind',
            'EC AIFS': 'aifs_medium-2t-wind',
            'FuXi': 'fuxi_medium-2t-wind'
        }
    },
    'medium-divergence': {
        levels: [1000, 925, 700, 500, 300],
        name: 'divergence',
        models: {
            'EC HRES': 'medium-divergence'
        }
    },
    'medium-vorticity': {
        levels: [850, 700, 500, 300, 250],
        name: 'vorticity',
        models: {
            'EC HRES': 'medium-vorticity'
        }
    },
    'medium-pv': {
        levels: [500, 300],
        name: 'pv',
        models: {
            'EC HRES': 'medium-pv'
        }
    },
    'medium-wind-10wg': {
        levels: [1000],
        name: 'medium-wind-10wg',
        models: {
            'EC HRES': 'medium-wind-10wg'
        }
    },
    'medium-shear': {
        levels: [1000],
        name: 'medium-shear',
        models: {
            'EC HRES': 'medium-shear'
        }
    },
    'medium-precipitation-type': {
        levels: [1000],
        name: 'medium-precipitation-type',
        models: {
            'EC HRES': 'medium-precipitation-type'
        }
    },
    'medium-rain-acc': {
        type: 'single-level',
        levels: [1000],
        models: {
            'Graphcast': 'graphcast_medium-rain-acc',
            'EC HRES':'medium-rain-acc',
            'EC AIFS': 'aifs_medium-rain-acc',
            'FuXi': 'fuxi_medium-rain-acc'
        }
    },
    'medium-rain-rate': {
        levels: ['tp_rate', 'lsp_rate', 'cp_rate', 'sf_rate'],
        name: ''
    },
    'medium-visibility': {
        levels: [1000],
        name: 'medium-visibility'
    },
    'opencharts_meteogram': {
        levels: ['classical_15d_with_climate', 'classical_wave', 'classical_10d', 'classical_plume', 'classical_15d'],
        name: 'Luoyang',
        type: 'point-based'
    },
    'aifs_opencharts_meteogram': {
        levels: ['aifs_classical_10d', 'aifs_classical_plume'],
        name: 'Luoyang',
        type: 'point-based'
    },
    'opencharts_vertical-profile-meteogram': {
        levels: ['opencharts_vertical-profile-meteogram'],
        name: 'Luoyang',
        type: 'point-based-profile'
    },
    'medium-mslp-rain': {
        type: 'single-level',
        levels: [1000],
        models: {
            'Graphcast': 'graphcast_medium-mslp-rain',
            'EC HRES':'medium-mslp-rain',
            'EC AIFS': 'aifs_medium-mslp-rain',
            'FuXi': 'fuxi_medium-mslp-rain'
        },
        interval: 12
    },
    'aifs_medium-mean-spread': {
        type: 'single-level',
        levels: [1000],
        models: {
            'AIFS-T2m': 'aifs_medium-2t-mean-spread',
            'AIFS-MSLP': 'aifs_medium-mslp-mean-spread',
            'AIFS-T850': 'aifs_medium-t850-mean-spread',
            'AIFS-T500': 'aifs_medium-t500-mean-spread',
            'AIFS-Z500': 'aifs_medium-z500-mean-spread',
            'AIFS-Z300': 'aifs_medium-z300-mean-spread',
        }
    }
};

export default CONFIG;

