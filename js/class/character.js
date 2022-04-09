class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache, _cursors) {
        super(_scene, _posX, _posY, _keyCache, _cursors);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.playerSpeed = 450, this.playerJump = 450, this.canJump = 0, this.canJumpMax = 10;
        this.friction = 0.001, this.airResistance = 0.2;
        this.targetRotation = 0, this.defaultRotation = 0.2, this.rotation_speed_min = 0.05, this.rotation_speed = this.rotation_speed_min;
        this.lastDir = 1, this.rolling = false, this.rollingCooldownMax = 60, this.rollingCooldown = 0;
        this.ledgeGrab = false;

        this.body.useDamping = true;
        this.setScale(1, 2).refreshBody();
    }

    update(_None, dt) {
        // LEFT & RIGHT
        if (!this.rolling) {
            if (cursors.left.isDown) {
                this.lastDir = -1;
                this.targetRotation = this.defaultRotation;
                this.flipX = true;
                this.setVelocityX(-this.playerSpeed);
            }
            else if (cursors.right.isDown) {
                this.lastDir = 1;
                this.targetRotation = -this.defaultRotation;
                this.flipX = false;
                this.setVelocityX(this.playerSpeed);
            }
            else {
                this.targetRotation = 0;
                this.setDragX(this.body.touching.down ? this.friction : this.airResistance);
            }
        }

        // LEDGE GRAB
        if (!this.body.touching.down && !this.rolling) {
            if (this.body.blocked.right || this.body.blocked.left) {
                this.setVelocityY(0);
                this.body.setAllowGravity(false);
                this.targetRotation = -this.targetRotation;
                this.rotation_speed *= 2;
                this.ledgeGrab = true;
            } else {
                this.body.setAllowGravity(true);
                this.rotation_speed = this.rotation_speed_min;
                this.ledgeGrab = false;
            }
        }

        // JUMP
        if (cursors.up.isDown && !this.rolling) {
            if (this.canJump > 0) {
                this.canJump = 0;
                this.setVelocityY(-this.playerJump);
            }
            
            if (this.body.blocked.right || this.body.blocked.left) {
                this.body.setAllowGravity(true);
                this.setVelocityY(-this.playerJump);
            }
        } else if (this.body.velocity.y < 0 && this.canJump == 0) {
            this.canJump = -1;
            this.setVelocityY(-this.playerJump/6);
        }

        if (!this.body.touching.down) {
            if (this.canJump > 0) { this.canJump -= 1; }
        } else if (this.body.touching.down) {
            this.canJump = this.canJumpMax;
        }

        // ROLL
        if (cursors.shift.isDown && this.rollingCooldown == 0 && !this.ledgeGrab) {
            switch(this.lastDir) {
                case 1:
                    if (this.targetRotation < 9) {
                        this.targetRotation = 9;
                    }
                    break;
                case -1:
                    if (this.targetRotation > -9) {
                        this.targetRotation = -9;
                    }
                    break;
            }

            this.rolling = true;
            this.setVelocityX(this.playerSpeed * this.lastDir);
            this.targetRotation += (this.defaultRotation) * this.lastDir;
            this.setScale(1, 1);
        } else if (this.rolling) {
            this.canJump = -1;
            this.setScale(1, 2);
            this.rolling = false;
            this.body.position.y -= 10;
            this.setVelocityY(-this.playerJump);
            this.rollingCooldown = this.rollingCooldownMax;
        } else if (this.rollingCooldown > 0) {
            this.rollingCooldown -= 1;
        }

        // SPRITE ROTATION
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, this.targetRotation, this.rotation_speed);
    }
}