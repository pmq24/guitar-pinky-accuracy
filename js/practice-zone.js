import { createApp } from 'https://unpkg.com/petite-vue?module'

export default function mount(id) {
	const element = getMountElement(id)
	const component = createComponent()
	component.mount("#" + element.id)
}

function getMountElement(id) {
	id = String(id)
	if (!id) {
		throw new Error("Id is required")
	}

	const e = document.getElementById(id)
  if (!e) {
    throw new Error(`Element with id "${id}" is not found`)
  }

	return e
}

function createComponent() {
	const options = {
		// States
		targetGeneratorId: null,
		target: null,
		fretted: "not fretted",
		metrics: {
			fretted: [],
			missed: 0
		},
		
		// Lifecycle hooks
		onMounted,
		onUnmounted,

		// Methods
		onRootTouchStart,
		onTargetClicked,

		// Helpers
		clientHeight() {
			return this.root().clientHeight
		},
		clientWidth() {
			return this.root().clientWidth
		},
		root() {
			return this.$refs.root
		},
		target() {
			return this.$refs.target
		},
		touch() {
			return this.$refs.touch	
		},
		
		// Metrics presentation
		totalTargets() {
			return this.metrics.fretted.length + this.metrics.missed
		},

		// Metrics calculations
		frettedTargets() {
			return this.metrics.fretted.length
		},
		
		averageDistance() {
			if (this.metrics.fretted.length === 0) return 0
			const sum = this.metrics.fretted.reduce((acc, item) => acc + item.distance, 0)
			return (sum / this.metrics.fretted.length).toFixed(2)
		},
		
		averageArea() {
			if (this.metrics.fretted.length === 0) return 0
			const sum = this.metrics.fretted.reduce((acc, item) => acc + item.area, 0)
			return (sum / this.metrics.fretted.length).toFixed(2)
		},
		
		lastDistance() {
			if (this.metrics.fretted.length === 0) return 0
			return this.metrics.fretted.at(-1).distance.toFixed(2)
		},
		
		lastArea() {
			if (this.metrics.fretted.length === 0) return 0
			return this.metrics.fretted.at(-1).area.toFixed(2)
		},
		
		missedTargets() {
			return this.metrics.missed
		}
	}

	return createApp(options)
}

function onMounted() {
	this.targetGeneratorId = setInterval(() => {

		const x = Math.random() * this.clientWidth()
		const y = Math.random() * this.clientHeight()

		const target = this.target()

		target.style.left = x + "px"
    target.style.top = y + "px"
		if (this.fretted === "not fretted") {
			this.metrics.missed++
		} else {
			this.fretted = "not fretted"
		}
	}, 2000)
}

function onUnmounted() {
	if (this.targetGeneratorId) {
		clearInterval(this.targetGeneratorId)
	}
}

function onRootTouchStart(e) {
	if (!(e instanceof TouchEvent)) {
		throw new Error("A TouchEvent handler is bound to non-touch event")
	}

	if (this.fretted !== "not fretted") {
		return
	}

	const touchData = e.touches[0]

	const touch = this.touch()
	const root = this.root()
	const rootBoundingClientRect = root.getBoundingClientRect()

	const viewportLeftDifference = rootBoundingClientRect.left
  touch.style.left = touchData.clientX - viewportLeftDifference + "px"

	const viewportTopDifference = rootBoundingClientRect.top
	touch.style.top = touchData.clientY - viewportTopDifference + "px"

	touch.style.height = touchData.radiusX * 50 + "px"
	touch.style.width = touchData.radiusY * 50 + "px"
	
	this.fretted = true
	const target = this.target()

	const targetRect = target.getBoundingClientRect()
	const targetCenterX = targetRect.left + targetRect.width / 2
	const targetCenterY = targetRect.top + targetRect.height / 2
	
	const touchX = touchData.clientX
	const touchY = touchData.clientY
	
	const distance = Math.sqrt(
		Math.pow(touchX - targetCenterX, 2) + 
		Math.pow(touchY - targetCenterY, 2)
	)

	if (distance <= 15) {
		this.metrics.fretted.push({
			distance,
			area: touchData.radiusX * touchData.radiusY * 250
		})
		this.fretted = "fretted"
	} else {
		this.metrics.missed++
		this.fretted = "missed"
	}
}

function onTargetClicked() {
	const target = this.target()
	target.disabled = true

}
